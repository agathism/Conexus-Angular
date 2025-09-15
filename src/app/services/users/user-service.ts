import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import User  from '../../models/user.interface';
import { BehaviorSubject, catchError, map, Observable, switchMap, tap, throwError } from 'rxjs';
import UserRegistration from '../../models/userRegistration.interface';

@Injectable({
  providedIn: 'root'
})

export class UserService {
  private readonly apiUrl = 'http://127.0.0.1:8000/api';
  private readonly userKey = 'authUser';
  private readonly tokenKey = 'authToken';
  
  // Observables pour suivre l'état d'authentification
  private loggedIn = new BehaviorSubject<boolean>(false);
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  
  // Observables publics
  isLoggedIn$ = this.loggedIn.asObservable();
  currentUser$ = this.currentUserSubject.asObservable();
  
  constructor(private httpClient: HttpClient) {
    this.initializeAuth();
  }
  
  // Initialise l'authentification au démarrage
  private initializeAuth(): void {
    const token = this.getToken();
    const storedUser = this.getUser();

    if (token && storedUser) {
      this.setAuthState(true, storedUser);
    }
  }
  
  // Me permet de mettre à jour l'état d'authentification
  private setAuthState(isAuthenticated: boolean, user: User | null = null): void {
    this.loggedIn.next(isAuthenticated);
    this.currentUserSubject.next(user);
  }
  
  // Je stocke les données d'authentification
  private storeAuthData(token: string, user: User): void {
    localStorage.setItem(this.tokenKey, token);
    localStorage.setItem(this.userKey, JSON.stringify(user));
    this.setAuthState(true, user);
  }
  
  // Inscription d'un nouvel utilisateur
  register(userDatas: UserRegistration): Observable<UserRegistration> {
    return this.httpClient.post<UserRegistration>(`${this.apiUrl}/register`, userDatas, {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    });
  }

  // Pour la connexion utilisateur
  login(credentials: { username: string; password: string }): Observable<User> {
  return this.httpClient.post<{ token: string }>(
    `${this.apiUrl}/login_check`,
    credentials,
    { headers: { 'Accept': 'application/json' } }
  ).pipe(
    switchMap(response => {
      console.log('✅ Token reçu:', response);
      
      if (!response.token) {
        return throwError(() => new Error('Pas de token reçu'));
      }
      // Sauvegarde temporaire du token
      localStorage.setItem(this.tokenKey, response.token);
      // On va chercher les infos de l’utilisateur
      return this.httpClient.get<User>(`${this.apiUrl}/me`, {
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${response.token}`
        }
      }).pipe(
        tap(user => {
          // Stockage définitif du token + user
          this.storeAuthData(response.token, user);
          console.log('💾 Données stockées dans localStorage:', user);
        }),
        catchError(error => {
          console.error('❌ Erreur récupération utilisateur:', error);
          this.logout(); // Nettoyer si souci
          return throwError(() => error);
        })
      );
    }),
    catchError(error => {
      console.error('❌ Erreur lors du login:', error);
      return throwError(() => error);
    })
    );
  }

  // Déconnexion
  logout(): void {
    this.setAuthState(false, null);
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.userKey);
  }

  // Récupère les infos de l'utilisateur actuel depuis l'API
  refreshCurrentUser(): Observable<User> {
    const token = this.getToken();
    const currentUser = this.getUser();
    
    if (!token || !currentUser?.id) {
      return throwError(() => new Error('Aucun utilisateur connecté'));
    }

    return this.httpClient.get<User>(`${this.apiUrl}/users/${currentUser.id}`, {
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    }).pipe(
      tap(user => {
        this.storeAuthData(token, user);
      })
    );
  }

  // Récupère le token stocké
  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  // Récupère l'utilisateur stocké
  getUser(): User | null {
    try {
      const user = localStorage.getItem(this.userKey);
      if (!user || user === 'undefined' || user === 'null') {
        return null;
      }
      return JSON.parse(user);
    } catch (error) {
      console.error('Erreur lecture localStorage:', error);
      return null;
    }
  }

  // Vérifie si l'utilisateur est authentifié
  isAuthenticated(): boolean {
    return this.loggedIn.value;
  }

  // Récupère l'ID de l'utilisateur connecté
  getCurrentUserId(): number | null {
    return this.getUser()?.id || null;
  }

  // Headers avec authentification pour les requêtes
  getAuthHeaders(): HttpHeaders {
    const token = this.getToken();
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': token ? `Bearer ${token}` : ''
    });
  }

  // Récupère tous les rôles de l'utilisateur connecté
  getUserRoles(): string[] {
    const user = this.getUser();
    return user?.roles || [];
  }

  // Observable pour suivre les changements de rôles
  get currentUserRoles$(): Observable<string[]> {
    return this.currentUser$.pipe(
      map(user => user?.roles || [])
    );
  }

  // Vérifie si l'utilisateur a un rôle spécifique
  hasRole(role: string): boolean {
    const userRoles = this.getUserRoles();
    return userRoles.includes(role);
  }

  // Vérifie si l'utilisateur a tous les rôles spécifiés
  hasAllRoles(roles: string[]): boolean {
    const userRoles = this.getUserRoles();
    return roles.every(role => userRoles.includes(role));
  }

  // Vérifie si l'utilisateur a au moins un des rôles spécifiés
  hasAnyRole(roles: string[]): boolean {
    const userRoles = this.getUserRoles();
    return userRoles.some(userRole => roles.includes(userRole));
  }

  // Récupère le rôle principal (premier dans la liste ou le plus élevé)
  getPrimaryRole(): string | null {
    const roles = this.getUserRoles();
    if (roles.length === 0) return null;
    
    // Ordre de priorité des rôles (du plus élevé au plus bas)
    const rolePriority = ['ROLE_ADMIN', 'ROLE_OWNER', 'ROLE_USER'];
    
    for (const priority of rolePriority) {
      if (roles.includes(priority)) {
        return priority;
      }
    }
    
    return roles[0]; // Retourne le premier si aucun n'est dans la priorité
  }

  // Vérifie si l'utilisateur est owner
  isOwner(): boolean {
    return this.hasRole('ROLE_OWNER');
  }

  // Vérifie si l'utilisateur est user
  isUser(): boolean {
    return this.hasRole('ROLE_USER');
  }

  // Vérifie si l'utilisateur est admin
  isAdmin(): boolean {
    return this.hasRole('ROLE_ADMIN');
  }
}
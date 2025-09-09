import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import User  from '../../models/user.interface';
import { BehaviorSubject, Observable, switchMap, tap, throwError } from 'rxjs';
import UserRegistration from '../../models/userRegistration.interface';

@Injectable({
  providedIn: 'root'
})

export class UserService {
  private apiUrl = 'http://127.0.0.1:8000/api';
  public userKey = 'authUser';
  public tokenKey = 'authToken';

  private loggedIn = new BehaviorSubject<boolean>(false);
  isLoggedIn$ = this.loggedIn.asObservable();

  // Nouvel observable pour l’utilisateur courant
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  currentUser$ = this.currentUserSubject.asObservable();

  constructor(private httpClient: HttpClient) {
    // Au démarrage, recharger depuis le localStorage
    const token = this.getToken();
    const storedUser = this.getUser();

    if (token && storedUser) {
      this.loggedIn.next(true);
      this.currentUserSubject.next(storedUser);
    }
  }

  login(user: { username: string; password: string }) {
    return this.httpClient.post<{ token: string; id: number }>(
      `${this.apiUrl}/login_check`,
      user,
      { headers: { 'Accept': 'application/json' } }
    ).pipe(
      switchMap(response => {
        // Stocker le token
        localStorage.setItem(this.tokenKey, response.token);
        this.loggedIn.next(true);

        // Charger le profil de l’utilisateur
        return this.httpClient.get<User>(`${this.apiUrl}/user`, {
          headers: { 'Authorization': `Bearer ${response.token}` }
        }).pipe(
          tap(userData => {
            localStorage.setItem(this.userKey, JSON.stringify(userData));
            this.currentUserSubject.next(userData); // 🔥 Notifie l’app
          })
        );
      })
    );
  }

  logout() {
    this.loggedIn.next(false);
    this.currentUserSubject.next(null);
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.userKey);
  }

  register(user: UserRegistration): Observable<UserRegistration> {
    return this.httpClient.post<UserRegistration>(
      `${this.apiUrl}/users`,
      user,
      {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      }
    );
  }

  getCurrent(id: number, token: string): Observable<User> {
    return this.httpClient.get<User>(
      `${this.apiUrl}/users/${id}`,
      {
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      }
    ).pipe(
      tap(user => {
        localStorage.setItem(this.userKey, JSON.stringify(user));
        this.currentUserSubject.next(user); // 🔥 Notifie l’app
      })
    );
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  getUser(): User | null {
    try {
      const user = localStorage.getItem(this.userKey);
      return user ? JSON.parse(user) : null;
    } catch (error: unknown) {
      console.error('Erreur lors de la lecture du localStorage:', error);
      return null;
    }
  }

  private handleError(error: HttpErrorResponse) {
    console.error('Erreur lors de la récupération du profil:', error);
    return throwError(() => new Error('Erreur lors de la récupération du profil'));
  }
}
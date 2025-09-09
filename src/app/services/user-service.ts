import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import User  from '../models/user.interface';
import { BehaviorSubject, Observable, tap, throwError } from 'rxjs';
import UserRegistration from '../models/userRegistration.interface';

@Injectable({
  providedIn: 'root'
})

export class UserService {
  private apiUrl = 'http://127.0.0.1:8000/api';
  public userKey = 'authUser';
  public tokenKey = 'authToken';
  private loggedIn = new BehaviorSubject<boolean>(false);
  isLoggedIn$ = this.loggedIn.asObservable();

  constructor(private httpClient: HttpClient) {
    //  Vérifier si un token existe déjà dans le localStorage
    const token = this.getToken();
    if (token) {
      this.loggedIn.next(true);
    }
  }

  login(user: { username: string; password: string }) {
  return this.httpClient.post<{ token: string; id: number }>(
    `${this.apiUrl}/login_check`,
    user,
    { headers: { 'Accept': 'application/json' } }
  ).pipe(
    tap(response => {
      // Stocker le token
      localStorage.setItem(this.tokenKey, response.token);
      this.loggedIn.next(true);
      // Charger le token de l'utilisateur connecté
      // Charger l’utilisateur connecté via /api/user
        this.httpClient.get(`${this.apiUrl}/user`, {
          headers: {
            'Authorization': `Bearer ${response.token}`
          }
        }).subscribe(userData => {
          localStorage.setItem(this.userKey, JSON.stringify(userData));
        });
    }));
  }

  logout() {
    this.loggedIn.next(false);
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
      }),
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
  return throwError(() => new Error('Erreur lors de la récupération du profil'))};
}
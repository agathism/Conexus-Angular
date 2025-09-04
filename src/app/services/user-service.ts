import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import User  from '../models/user.interface';

@Injectable({
  providedIn: 'root'
})

export class UserService {
private httpClient = inject(HttpClient);
  private apiUrl = 'http://127.0.0.1:8000/api';

  login(user: { username: string; password: string }) {
    return this.httpClient.post<{ token: string }>(
      `${this.apiUrl}/login_check`,
      user,
      {
        headers: { 'Accept': 'application/json' }
      }
    );
  }

  register(user: User) {
    return this.httpClient.post(
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

  getCurrent(token: string) {
    return this.httpClient.get(
      `${this.apiUrl}/me`,
      {
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      }
    );
  }
}
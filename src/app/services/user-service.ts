import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { User } from '../models/user.interface';

@Injectable({
  providedIn: 'root'
})

export class UserService {
  private httpClient: HttpClient = inject(HttpClient);
  
  login(user: Partial<User>) {
    return this.httpClient.post('' + 'auth', user, {
      headers: {
        accept: 'application/json'
      }
    });
  }

  register(user: User) {
  return this.httpClient.post('api/users', user, {
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    }
  });
}

  getCurrent(token: string) {
    return this.httpClient.get('' + 'api/me', {
      headers: {
        accept: 'application/json',
        'Authorization': `Bearer ${token}`
      }, withCredentials: true
    });
  }
}
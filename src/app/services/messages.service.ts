import { inject, Injectable, OnInit } from '@angular/core';
import Message from '../models/message.interface';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class MessagesService implements OnInit {
  private httpClient = inject(HttpClient);
  private apiUrl = 'http://127.0.0.1:8000/api/messages';

  ngOnInit(): void {
  }
  getMessages(): Observable<Message[]> {
    return this.httpClient.get<Message[]>(this.apiUrl, {
      headers: { 'accept': 'application/json' }
    });
  }
}
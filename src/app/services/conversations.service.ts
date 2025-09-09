import { inject, Injectable} from '@angular/core';
import Conversation from '../models/conversation.interface';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ConversationsService{
  private httpClient = inject(HttpClient);
  private apiUrl = 'http://127.0.0.1:8000/api/conversations';

  getConversations(): Observable<Conversation[]> {
    return this.httpClient.get<Conversation[]>(
      `${this.apiUrl}`,
      {
      headers: { 'accept': 'application/json' }
    });
  }
}

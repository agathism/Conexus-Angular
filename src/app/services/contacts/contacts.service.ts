import { inject, Injectable} from '@angular/core';
import Contact from '../../models/contact.interface';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ContactsService{
  private httpClient = inject(HttpClient);
  private apiUrl = 'http://127.0.0.1:8000/api/contacts';

  sendContact(): Observable<Contact[]> {
    return this.httpClient.post<Contact[]>(this.apiUrl, {
      headers: { 'accept': 'application/json' }
    });
  }
}

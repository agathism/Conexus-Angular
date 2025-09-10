import { inject, Injectable} from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ContactsService{
  private httpClient = inject(HttpClient);
  private apiUrl = 'http://127.0.0.1:8000/api/contacts';

  // CORRIGÉ: La méthode doit RECEVOIR les données et les ENVOYER
  sendContact(contactData: any): Observable<any> {
    return this.httpClient.post<any>(this.apiUrl, contactData, {
      headers: { 
        'Content-Type': 'application/json',
        'Accept': 'application/json' 
      }
    });
  }
}

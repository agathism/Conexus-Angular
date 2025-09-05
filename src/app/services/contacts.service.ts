import { inject, Injectable, OnInit } from '@angular/core';
import Contact from '../models/contact.interface';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ContactsService implements OnInit {
  private httpClient = inject(HttpClient);
  private apiUrl = 'http://127.0.0.1:8000/api/contacts';

  ngOnInit(): void {
  }
  getContacts(): Observable<Contact[]> {
    return this.httpClient.get<Contact[]>(this.apiUrl, {
      headers: { 'accept': 'application/json' }
    });
  }
}

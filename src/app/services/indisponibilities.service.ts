import { inject, Injectable, OnInit } from '@angular/core';
import Indisponibility from '../models/indisponibility.interface';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class IndisponibilitiesService{
  private httpClient = inject(HttpClient);
  private apiUrl = 'http://127.0.0.1:8000/api/indisponibilities';

  getIndisponibilities(): Observable<Indisponibility[]> {
    return this.httpClient.get<Indisponibility[]>(this.apiUrl, {
      headers: { 'accept': 'application/json' }
    });
  }
}

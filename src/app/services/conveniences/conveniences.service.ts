import { inject, Injectable, OnInit } from '@angular/core';
import Convenience from '../../models/convenience.interface';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ConveniencesService{
  private httpClient = inject(HttpClient);
  private apiUrl = 'http://127.0.0.1:8000/api/conveniences';

  getConveniences(): Observable<Convenience[]> {
    return this.httpClient.get<Convenience[]>(this.apiUrl, {
      headers: { 'accept': 'application/json' }
    });
  }
}
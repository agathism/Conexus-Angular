import { Injectable, inject, OnInit } from '@angular/core';
import City from '../models/city.interface';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CitiesService{
  private httpClient: HttpClient = inject(HttpClient);
  private apiUrl = 'http://127.0.0.1:8000/api/cities';

    getCities(): Observable<City[]> {
      return this.httpClient.get<City[]>(this.apiUrl, {
        headers: { 'accept': 'application/json' }
      });
    }
}

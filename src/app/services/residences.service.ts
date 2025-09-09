import { inject, Injectable, OnInit } from '@angular/core';
import Residence from '../models/residence.interface';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ResidencesService{
  private httpClient = inject(HttpClient);
  private apiUrl = 'http://127.0.0.1:8000/api/residences';

  getResidences(): Observable<Residence[]> {
    return this.httpClient.get<Residence[]>(this.apiUrl, {
      headers: { 'accept': 'application/json' }
    });
  }

  // getResidenceById(): Observable<Residence[]> {
  //   return this.httpClient.get<Residence[]>(
  //     `${this.apiUrl}/${id}`, {
  //     headers: { 'accept': 'application/json' }
  //   });
  // }
}   
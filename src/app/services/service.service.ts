import { Injectable, inject, OnInit } from '@angular/core';
import Service from '../models/service.interface';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ServiceService implements OnInit {
  private httpClient = inject(HttpClient);
  private apiUrl = 'http://127.0.0.1:8000/api/services';
  ngOnInit(): void {
  }
  getServices(): Observable<Service[]> {
    return this.httpClient.get<Service[]>(this.apiUrl, {
      headers: { 'accept': 'application/json' }
    });
  }
}

import { Injectable, inject, OnInit } from '@angular/core';
import City from '../models/city.interface';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CitiesService implements OnInit {
  private httpClient: HttpClient = inject(HttpClient);
  private apiUrl = 'http://127.0.0.1:8000/api/cities';
  private baseUrl = 'http://127.0.0.1:8000'; 

  cities: City[] = [];
  ngOnInit(): void {
    this.httpClient.get<City[]>(this.apiUrl, {
      headers: { 'accept': 'application/json' }
    }).subscribe({
      next: (data) => {
        this.cities = data.map(city => ({
          ...city,
          image: `${this.baseUrl}/${city.imageUrl}` 
        }));
        console.log(this.cities);
      },
      error: (error) => {
        console.error('Erreur lors du chargement des villes:', error);
      }
    });
  }
}

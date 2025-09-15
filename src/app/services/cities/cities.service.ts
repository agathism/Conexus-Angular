import { Injectable, inject } from '@angular/core';
import City from '../../models/city.interface';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';

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

  // Recherche par nom partiel (ex: ?name=par)
  searchCities(query: string): Observable<City[]> {
    return this.httpClient.get<any>(`${this.apiUrl}?name=${query}`, {
      headers: { accept: 'application/json' }
    }).pipe(
      map(res => res['hydra:member'])
      // API Platform utilise Hydra (JSON-LD).
      // Les objets retournés sont dans "hydra:member".
      // On extrait donc ce tableau pour ne garder que la liste des villes.
    );
  }
}

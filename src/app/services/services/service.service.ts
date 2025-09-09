import { Injectable, inject} from '@angular/core';
import Service from '../../models/service.interface';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ServiceService{
  private httpClient = inject(HttpClient);
  private apiUrl = 'http://127.0.0.1:8000/api/services';

  getServices(): Observable<Service[]> {
    return this.httpClient.get<Service[]>(this.apiUrl, {
      headers: { 'accept': 'application/json' }
    });
  }
}

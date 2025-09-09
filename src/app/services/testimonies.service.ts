import { inject, Injectable} from '@angular/core';
import Testimony from '../models/testimony.interface';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class TestimoniesService {
  private httpClient = inject(HttpClient);
  private apiUrl = 'http://127.0.0.1:8000/api/testimonies';

  getTestimonies(): Observable<Testimony[]> {
    return this.httpClient.get<Testimony[]>(this.apiUrl, {
      headers: { 'accept': 'application/json' }
    });
  }
}


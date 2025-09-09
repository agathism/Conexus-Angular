import { inject, Injectable} from '@angular/core';
import Topic from '../models/topic.interface';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class TestimoniesService{
  private httpClient = inject(HttpClient);
  private apiUrl = 'http://127.0.0.1:8000/api/topics';

  getTopic(): Observable<Topic[]> {
    return this.httpClient.get<Topic[]>(this.apiUrl, {
      headers: { 'accept': 'application/json' }
    });
  }
}

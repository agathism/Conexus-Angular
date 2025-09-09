import { inject, Injectable} from '@angular/core';
import Question from '../models/question.interface';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class QuestionsService{
  private httpClient = inject(HttpClient);
  private apiUrl = 'http://127.0.0.1:8000/api/questions';

  getQuestions(): Observable<Question[]> {
    return this.httpClient.get<Question[]>(this.apiUrl, {
      headers: { 'accept': 'application/json' }
    });
  }
}
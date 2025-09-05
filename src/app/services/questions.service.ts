import { inject, Injectable, OnInit } from '@angular/core';
import Question from '../models/question.interface';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class QuestionsService implements OnInit {
  private httpClient = inject(HttpClient);
  private apiUrl = 'http://127.0.0.1:8000/api/questions';

  ngOnInit(): void {
  }
  getQuestions(): Observable<Question[]> {
    return this.httpClient.get<Question[]>(this.apiUrl, {
      headers: { 'accept': 'application/json' }
    });
  }
}
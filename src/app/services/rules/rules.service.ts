import { inject, Injectable} from '@angular/core';
import Rule from '../../models/rule.interface';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class RulesService{
  private httpClient = inject(HttpClient);
  private apiUrl = 'http://127.0.0.1:8000/api/rules';

  getRules(): Observable<Rule[]> {
    return this.httpClient.get<Rule[]>(this.apiUrl, {
      headers: { 'accept': 'application/json' }
    });
  }
}

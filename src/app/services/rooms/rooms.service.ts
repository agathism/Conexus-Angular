import { inject, Injectable} from '@angular/core';
import Room from '../../models/room.interface';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class RoomsService{
  private httpClient = inject(HttpClient);
  private apiUrl = 'http://127.0.0.1:8000/api/rooms';

  getRooms(): Observable<Room[]> {
    return this.httpClient.get<Room[]>(this.apiUrl, {
      headers: { 'accept': 'application/json' }
    });
  }
}

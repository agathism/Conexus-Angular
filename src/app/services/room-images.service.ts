import { inject, Injectable} from '@angular/core';
import RoomImage from '../models/roomImage.interface';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class RoomImagesService{
  private httpClient = inject(HttpClient);
  private apiUrl = 'http://127.0.0.1:8000/api/rooms_images';

  getRoomsImages(): Observable<RoomImage[]> {
    return this.httpClient.get<RoomImage[]>(this.apiUrl, {
      headers: { 'accept': 'application/json' }
    });
  }
}

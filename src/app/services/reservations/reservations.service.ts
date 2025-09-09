import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import Reservation from '../../models/reservation.interface';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ReservationsService {
  private httpClient = inject(HttpClient);
  private apiUrl = 'http://127.0.0.1:8000/api/reservations';

  getReservations(): Observable<Reservation[]> {
    return this.httpClient.get<Reservation[]>(this.apiUrl, {
      headers: { 'accept': 'application/json' }
    });
  }
}

import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import Reservation from '../../models/reservation.interface';
import { UserService } from '../users/user-service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ReservationsService {
  private httpClient = inject(HttpClient);
  private userService = inject(UserService);
  private apiUrl = 'http://127.0.0.1:8000/api/reservations';
  private myResidenceUrl = 'http://127.0.0.1:8000/api/my-residences'

  getReservations(): Observable<Reservation[]> {
    return this.httpClient.get<Reservation[]>(this.apiUrl, {
      headers: { 'accept': 'application/json' }
    });
  }

  // Permet de récupérer les résidences qui me concerne
  getMyReservations(): Observable<Reservation[]> {
    return this.httpClient.get<Reservation[]>(this.myResidenceUrl, {
      headers: this.userService.getAuthHeaders()
    });
  }
}

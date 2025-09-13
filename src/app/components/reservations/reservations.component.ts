import { Component, inject } from '@angular/core';
import { ReservationsService } from '../../services/reservations/reservations.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import Reservation from '../../models/reservation.interface';

@Component({
  selector: 'app-reservations',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './reservations.component.html',
  styleUrl: './reservations.component.css'
})
export class ReservationsComponent {
  private reservationsService = inject(ReservationsService);
    private router = inject(Router);
    // Liste des réservations
    reservations: Reservation[] = [];
      
    // États de l'application
    isLoading = false;
    errorMessage = '';
    resultCount = 0;
  
    ngOnInit(): void{
      this.loadMyReservations();
    }
  
    // Charge toutes mes réservations
      private loadMyReservations(): void {
      this.isLoading = true;
      this.errorMessage = '';
    
      this.reservationsService.getMyReservations().subscribe({
        next: (data: Reservation[]) => {
          this.reservations = data;
          this.isLoading = false;
          console.log('✅ Réservations chargées:', this.reservations);
        },
        error: (err) => {
          this.handleError('Erreur lors du chargement des résidences', err);
          this.isLoading = false;
        }
      });
    }
  
    // Gestion centralisée des erreurs
    private handleError(message: string, error: any): void {
      console.error('❌', message, error);
      if (error?.error?.message) {
        this.errorMessage = error.error.message;
      } else {
        this.errorMessage = message + '. Veuillez réessayer.';
      }
    }
}

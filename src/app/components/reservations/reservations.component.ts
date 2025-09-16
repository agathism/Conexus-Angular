import { Component, inject } from '@angular/core';
import { ReservationsService } from '../../services/reservations/reservations.service';
import { Router } from '@angular/router';
import { CommonModule, DatePipe } from '@angular/common';
import Reservation from '../../models/reservation.interface';

@Component({
  selector: 'app-reservations',
  standalone: true,
  imports: [CommonModule, DatePipe],
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

  getStatus(status: string): string {
  const baseClass = 'w-18 rounded-lg font-medium flex justify-center items-center';
    
  switch(status) {
    case 'Annulé':
      return `${baseClass} bg-red-100 text-red-800 hover:bg-red-200`;
    case 'Validé':
      return `${baseClass} bg-green-100 text-green-800 hover:bg-green-200`;
    case 'Refusé':
      return `${baseClass} bg-red-100 text-red-800 hover:bg-red-200`;
    case 'En attente':
        return `${baseClass} bg-yellow-100 text-yellow-800 hover:bg-yellow-200`;
    case 'Actif':
        return `${baseClass} bg-blue-100 text-blue-800 hover:bg-blue-200`;
    default:
      return `${baseClass} bg-gray-100 text-gray-800 hover:bg-gray-200`;
    }
  }
}

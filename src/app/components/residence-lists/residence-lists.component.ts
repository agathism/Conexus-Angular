import { Component, inject, OnInit } from '@angular/core';
import Residence from '../../models/residence.interface';
import { ResidencesService } from '../../services/residences/residences.service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-residence-lists',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './residence-lists.component.html',
  styleUrl: './residence-lists.component.css'
})
export class ResidenceListsComponent implements OnInit{
  private residencesService = inject(ResidencesService);
  private router = inject(Router);
  // Liste des résidences
  residences: Residence[] = [];
    
  // États de l'application
  isLoading = false;
  errorMessage = '';
  resultCount = 0;

  ngOnInit(): void{
    this.loadMyResidences();
  }

  // Charge toutes mes résidences
    private loadMyResidences(): void {
    this.isLoading = true;
    this.errorMessage = '';
  
    this.residencesService.getMyResidences().subscribe({
      next: (data: Residence[]) => {
        this.residences = data;
        this.isLoading = false;
        console.log('✅ Résidences chargées:', this.residences);
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

  goToDetail(residence: Residence): void {
      this.router.navigate(['/app-residence-detail', residence.id]);
  }
}

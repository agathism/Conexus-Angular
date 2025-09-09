import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ResidencesService } from '../../services/residences.service';
import Residence from '../../models/residence.interface';

@Component({
  selector: 'app-residence-search',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './residence-search.component.html',
  styleUrl: './residence-search.component.css'
})
export class ResidenceSearchComponent {
  private residencesService = inject(ResidencesService);
    residences: Residence[] = [];

    ngOnInit(): void {
    this.loadResidences();
    }

    private loadResidences(): void {
    this.residencesService.getResidences().subscribe({
      next: (data) => {
        this.residences = data;
        console.log('✅ Résidences chargés:', this.residences);
      },
      error: (err) => {
        console.error('❌ Erreur Residences API:', err);
      }
    });
  } 
}

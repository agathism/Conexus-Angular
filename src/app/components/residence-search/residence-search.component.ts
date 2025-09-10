import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { ResidencesService } from '../../services/residences/residences.service';
import Residence from '../../models/residence.interface';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import SearchFilters from '../../models/searchFilters.interface';

@Component({
  selector: 'app-residence-search',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './residence-search.component.html',
  styleUrl: './residence-search.component.css'
})
export class ResidenceSearchComponent implements OnInit {
  // Formulaire de recherche
  searchForm: FormGroup;
  private formBuilder = inject(FormBuilder);
  private residencesService = inject(ResidencesService);
  private router = inject(Router);

  
  // Liste des résidences
  residences: Residence[] = [];
  
  // États de l'application
  isLoading = false;
  errorMessage = '';
  resultCount = 0;

  constructor() {
    this.searchForm = this.formBuilder.group({
      title: [''],
      address: [''],
      city: [''],
      amountShowers: [''],
      monthlyPrice: [''],
      surface: [''],
      createdAt: [''] 
    });
  }

  ngOnInit(): void {
    this.loadAllResidences();
  }

  /**
   * Charge toutes les résidences au démarrage
   */
  private loadAllResidences(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.residencesService.getResidences().subscribe({
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

  /**
   * Effectue une recherche avec les critères du formulaire
   */
  onSearch(): void {
    this.isLoading = true;
    this.errorMessage = '';

    const searchFilters = this.buildSearchFilters();
    
    // Si aucun filtre n'est défini, charger toutes les résidences
    if (this.isEmptyFilters(searchFilters)) {
      this.loadAllResidences();
      return;
    }

    this.residencesService.searchResidences(searchFilters).subscribe({
      next: (data: Residence[]) => {
        this.residences = data;
        this.isLoading = false;
        this.resultCount = data.length;
        console.log( this.resultCount, 'résidence(s) trouvée(s)');
      },
      error: (err) => {
        this.handleError('Erreur lors de la recherche', err);
        this.isLoading = false;
      }
    });
  }

  /**
   * Remet à zéro les filtres et recharge toutes les résidences
   */
  onReset(): void {
    this.searchForm.reset();
    this.loadAllResidences();
  }

  /**
   * Construction de l'objet de filtres à partir du formulaire
   */
  private buildSearchFilters(): SearchFilters {
    const formValue = this.searchForm.value;
    const filters: SearchFilters = {};

    // Ajouter seulement les champs non vides
    Object.keys(formValue).forEach(key => {
      const value = formValue[key];
      if (value !== null && value !== undefined && value !== '') {
        filters[key as keyof SearchFilters] = value;
      }
    });

    return filters;
  }

  /**
   * Vérifie si les filtres sont vides
   */
  private isEmptyFilters(filters: SearchFilters): boolean {
    return Object.keys(filters).length === 0;
  }

  /**
   * Gestion centralisée des erreurs
   */
  private handleError(message: string, error: any): void {
    console.error('❌', message, error);
    
    if (error?.error?.message) {
      this.errorMessage = error.error.message;
    } else {
      this.errorMessage = message + '. Veuillez réessayer.';
    }
  }

  /**
   * Getters pour faciliter l'accès aux contrôles du formulaire dans le template
   */
  get titleControl() { return this.searchForm.get('title'); }
  get addressControl() { return this.searchForm.get('address'); }
  get cityControl() { return this.searchForm.get('city'); }
  get amountShowersControl() { return this.searchForm.get('amountShowers'); }
  get monthlyPriceControl() { return this.searchForm.get('monthlyPrice'); }
  get surfaceControl() { return this.searchForm.get('surface'); }
  get createdAtControl() { return this.searchForm.get('createdAt'); }
}

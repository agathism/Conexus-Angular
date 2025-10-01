import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ResidencesService } from '../../services/residences/residences.service';
import { Router } from '@angular/router';
import Residence from '../../models/residence.interface';

@Component({
  selector: 'app-residence-create',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './residence-create.component.html',
  styleUrl: './residence-create.component.css'
})
export class ResidenceCreateComponent {
  residenceForm: FormGroup;
  errorMessage = '';
  successMessage = '';
  isSubmitting = false;
  isLoading = false;

  private router = inject(Router);
  private formBuilder = inject(FormBuilder);
  private residenceService = inject(ResidencesService);

  constructor(){
      this.residenceForm = this.formBuilder.group({
      title: ['', [ Validators.required ]],
      description: ['', [ Validators.required ]],
      address: ['', [ Validators.required ]],
      city: ['', [ Validators.required ]],
      amountShowers: ['', [ Validators.required ]],
      surface: ['', [ Validators.required ]],
      monthlyPrice: ['', [ Validators.required ]],
      imageUrl: ['', [ Validators.required ]]
      });
    }

  // Méthode appelée lors de la soumission du formulaire
  monFormEstSoumis() {
    if (this.residenceForm.valid) {
      // Récupère toutes les données du formulaire
      const residenceData = {
        title: this.residenceForm.value.title,        
        description: this.residenceForm.value.description,
        address: this.residenceForm.value.address,
        amountShowers: this.residenceForm.value.amountShowers,
        monthlyPrice: this.residenceForm.value.monthlyPrice,
        surface: this.residenceForm.value.surface,
        city: this.residenceForm.value.city,
        imageUrl: this.residenceForm.value.imageUrl
      };

      // Appel du service pour la création de l'utilisateur
      this.residenceService.createResidence(residenceData).subscribe({
        next: (response: any) => {
          console.log('Création réussie !', response);
          // Message de succès 
          this.errorMessage = 'Création réussie ! Vous pouvez visiter la page de la résidence.';
          // Rédirection vers la page de détail de la résidence crée
          // Appel correct de la fonction avec la réponse
          if (response && response.residence && response.residence.id) {
            this.goToDetail(response);
          } else {
            console.warn("⚠️ Pas d'ID trouvé dans la réponse :", response);
          }
        },
        error: (err: any) => {
          console.error('Erreur création:', err);
          // Gestion des messages d'erreur
          if (err?.error?.message) {
            this.errorMessage = err.error.message;
          } else {
            this.errorMessage = 'Erreur lors de la création. Veuillez réessayer.';
          }
        }
      });
    } else {
      // Affichage du message si le formulaire n'est pas valide
      this.errorMessage = 'Veuillez remplir correctement tous les champs obligatoires.';
    }
  }

  goToDetail(residence: Residence): void {
      this.router.navigate(['/app-residence-detail', residence.id]);
  }

  create() {
      this.isLoading = true;
      setTimeout(() => {
        this.isLoading = false;
        console.log('Connexion réussi !');
      }, 3000);
    }
}

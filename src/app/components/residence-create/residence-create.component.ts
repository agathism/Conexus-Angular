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
  private router = inject(Router);

  private formBuilder = inject(FormBuilder);
  private residenceService = inject(ResidencesService);

  constructor() {
      this.residenceForm = this.formBuilder.group({
      title: ['', [
        Validators.required,
        Validators.minLength(5),
        Validators.maxLength(100)
      ]],
      description: ['', [
        Validators.required,
        Validators.minLength(20),
        Validators.maxLength(500)
      ]],
      address: ['', [
        Validators.required,
        Validators.minLength(10)
      ]],
      city: ['', [
        Validators.required
      ]],
      amountShowers: ['', [
        Validators.required,
        Validators.min(1),
        Validators.max(5)
      ]],
      surface: ['', [
        Validators.required,
        Validators.min(20),
        Validators.max(500)
      ]],
      monthlyPrice: ['', [
        Validators.required,
        Validators.min(300),
        Validators.max(5000)
      ]]
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
      };

      // Appel du service pour la création de l'utilisateur
      this.residenceService.createResidence(residenceData).subscribe({
        next: (response: any) => {
          console.log('Création réussie !', response);
          // Message de succès 
          this.errorMessage = 'Création réussie ! Vous pouvez visiter la page de la résidence.';
          // Rédirection vers la page de détail de la résidence crée
          this.router.navigate(['/app-residence-detail']);
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

}

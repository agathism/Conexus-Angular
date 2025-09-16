import { Component, inject } from '@angular/core';
import User from '../../models/user.interface';
import { UserService } from '../../services/users/user-service';
import { Router, RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule, DatePipe} from '@angular/common';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterLink, DatePipe],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})

export class ProfileComponent {
  private userService = inject(UserService);
  private router = inject(Router);
  user?: User;
  // Déclaration du formulaire de modification
  modifyForm: FormGroup;
  // Message d'erreur à afficher à l'utilisateur
  errorMessage = '';
  // Injection des services nécessaires
  private formBuilder = inject(FormBuilder);
  isLoading = false;
  successMessage = '';
  // isOwner: typeof this.userService.isOwner; 

  constructor() {
    // Initialisation du formulaire avec les champs et leurs validations
    this.modifyForm = this.formBuilder.group({
      name: [''],
      email: ['', [Validators.email]],
      password: ['', [Validators.minLength(6)]], // Validation de la longueur du mot de passe
      userGenre: [''],
      birthDate: [''],
      profilePicture: ['']
    });
  }

  ngOnInit() {
    console.log('🔍 Initialisation du composant profile');
    console.log('📦 Token dans localStorage:', this.userService.getToken());
    console.log('👤 User dans localStorage:', this.userService.getUser());
    
    this.userService.currentUser.subscribe(user => {
      console.log('🔄 Changement d\'état utilisateur:', user);
      
      if (user) {
        this.user = user;
        console.log("✅ Utilisateur connecté:", user);
        if (this.router.url === '/app-login') {
          this.router.navigate(['/app-profile']);
        }
      } else {
        console.log("ℹ️ Aucun utilisateur connecté");
        this.router.navigate(['/app-login']);
      }
    });
  }

  submitting() {
    this.isLoading = true;
    setTimeout(() => {
      this.isLoading = false;
      console.log('Connexion réussi !');
    }, 3000);
  }
  
  // Méthode appelée lors de la soumission du formulaire
  // monFormEstSoumis() {
  //   if (this.modifyForm.valid) {
  //     // Récupère toutes les données du formulaire
  //     const userDatas = {
  //       name: this.modifyForm.value.name,        
  //       email: this.modifyForm.value.email,
  //       password: this.modifyForm.value.password,
  //       userGenre: this.modifyForm.value.userGenre,
  //       birthDate: this.modifyForm.value.birthDate,
  //       profilePicture: this.modifyForm.value.profilePicture
  //     };
  
      // Appel du service pour la modification de l'utilisateur
    //   this.userService.modify(userDatas).subscribe({
    //     next: (response: any) => {
    //      this.isLoading = false;
    //       this.successMessage = 'Profil modifié avec succès !';
    //       this.errorMessage = '';
          
    //       // Effacer le message après 5 secondes
    //       setTimeout(() => {
    //         this.successMessage = '';
    //       }, 5000);
    //       console.log('✅ Modification réussie:', response);
    //     },
    //     error: (err) => {
    //       this.isLoading = false;
    //       this.successMessage = '';
    //       console.error('❌ Erreur modification:', err);
    //       // Gestion des messages d'erreur
    //       if (err?.error?.message) {
    //         this.errorMessage = err.error.message;
    //       } else if (err?.error?.violations) {
    //         // Gestion des erreurs de validation Symfony
    //         const violations = err.error.violations;
    //         this.errorMessage = violations.map((v: any) => v.message).join(', ');
    //       } else {
    //         this.errorMessage = 'Erreur lors de la modification. Veuillez réessayer.';
    //       }
    //     }
    //   });
    // } else {
      // Marquer tous les champs comme touchés pour afficher les erreurs
  //     this.modifyForm.markAllAsTouched();
  //     this.errorMessage = 'Veuillez corriger les erreurs dans le formulaire.';
  //   }
  // }
}

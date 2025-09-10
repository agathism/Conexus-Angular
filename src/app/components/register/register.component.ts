import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { UserService } from '../../services/users/user-service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [RouterLink, ReactiveFormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  // Déclaration du formulaire d'inscription
  registerForm: FormGroup;
  // Message d'erreur à afficher à l'utilisateur
  errorMessage = '';

  // Injection des services nécessaires
  private formBuilder = inject(FormBuilder);
  private userService = inject(UserService);
  private router = inject(Router);

  constructor() {
    // Initialisation du formulaire avec les champs et leurs validations
    this.registerForm = this.formBuilder.group({
      name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]], // Validation de la longueur du mot de passe
      userGenre: ['', [Validators.required]],
      birthDate: ['', [Validators.required]],
      profilePicture: ['', [Validators.required]]
    });
  }

  // Méthode appelée lors de la soumission du formulaire
  monFormEstSoumis() {
    if (this.registerForm.valid) {
      // Récupère toutes les données du formulaire
      const userDatas = {
        name: this.registerForm.value.name,        
        email: this.registerForm.value.email,
        password: this.registerForm.value.password,
        userGenre: this.registerForm.value.userGenre,
        birthDate: this.registerForm.value.birthDate,
        profilePicture: this.registerForm.value.profilePicture
      };

      // Appel du service pour l'inscription de l'utilisateur
      this.userService.register(userDatas).subscribe({
        next: (response: any) => {
          console.log('Inscription réussie !', response);
          // Connexion automatique après inscription
          this.loginAfterRegister(userDatas.email, userDatas.password);
          // Message de succès 
          this.errorMessage = 'Inscription réussie ! Vous pouvez vous connecter.';
          // Redirection vers le profil
          this.router.navigate(['/app-profile']);
        },
        error: (err: any) => {
          console.error('Erreur inscription:', err);
          // Gestion des messages d'erreur
          if (err?.error?.message) {
            this.errorMessage = err.error.message;
          } else {
            this.errorMessage = 'Erreur lors de l\'inscription. Veuillez réessayer.';
          }
        }
      });
    } else {
      // Affichage du message si le formulaire n'est pas valide
      this.errorMessage = 'Veuillez remplir correctement tous les champs obligatoires.';
    }
  }

  // Méthode pour connecter automatiquement l'utilisateur après inscription
  private loginAfterRegister(email: string, password: string) {
    this.userService.login({ username: email, password }).subscribe({
      next: (data: any) => {
        if (data?.token) {
          // Stocke le token d'authentification et redirige vers le profil
          localStorage.setItem('authToken', data.token);
          this.router.navigate(['/app-profile']);
        }
      },
      error: (err: any) => {
        console.error('Erreur connexion auto:', err);
        // Redirige vers la page de connexion en cas d'échec
        this.router.navigate(['/login']);
      }
    });
  }
}

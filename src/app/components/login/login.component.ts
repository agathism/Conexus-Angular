import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { UserService } from '../../services/user-service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterLink, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  loginForm: FormGroup;
  errorMessage = '';

  private formBuilder = inject(FormBuilder);
  private userService = inject(UserService);
  private router = inject(Router);

  constructor() {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
    });
  }

  monFormEstSoumis() {
    if (this.loginForm.valid) {
      const { email, password } = this.loginForm.value;
      this.userService.login({ username: email, password }).subscribe({
        next: (data: any) => {
          if (data && data.token) {
            localStorage.setItem('authToken', data.token);
            this.router.navigate(['/app-profile']);
          } else {
            this.errorMessage = "Aucun token reçu, la connexion a échoué.";
          }
        },
        error: (err: any) => {
          if (err && err.error && err.error.message) {
            this.errorMessage = err.error.message;
          } else {
            this.errorMessage = 'Une erreur inconnue est survenue.';
          }
        }
      });
    } else {
      this.errorMessage = 'Veuillez remplir correctement le formulaire.';
    }
  }
}

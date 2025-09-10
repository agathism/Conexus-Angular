import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { UserService } from '../../services/users/user-service';

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
      username: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
    });
  }

  monFormEstSoumis() {
    if (this.loginForm.valid) {
      const { username, password } = this.loginForm.value;
      this.userService.login({ username , password }).subscribe({
        next: (user) => {
          console.log('👤 Utilisateur connecté:', user);
          this.router.navigate(['/app-profile']).then(success => {
            console.log('Navigation vers /app-profile :', success);
          });
        },
        error: (err: any) => {
          if (err?.error?.message) {
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

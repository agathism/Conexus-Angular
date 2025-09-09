import { Component, inject } from '@angular/core';
import User from '../../models/user.interface';
import { UserService } from '../../services/user-service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent {
  private userService = inject(UserService);
  private router = inject(Router);
  user?: User;

  ngOnInit(): void {
    this.loadUser();
  }

  private loadUser(): void {
    const userData = localStorage.getItem(this.userService.userKey); 
    const token = localStorage.getItem(this.userService.tokenKey);  
    
    let userId: number | null = null;
    
    if (userData) {
      try {
        const parsedUser = JSON.parse(userData);
        userId = parsedUser?.id;
        console.log('UserId extrait:', userId);
      } catch (e) {
        console.error('Erreur lors du parsing userData:', e);
      }
    }

    if (userId && token) {
      this.userService.getCurrent(userId, token).subscribe({
        next: (data) => {
          this.user = data;
          console.log('✅ Utilisateur chargé:', this.user);
        },
        error: (err) => {
          console.error('❌ Erreur API:', err);
          // Rediriger vers login si erreur
          this.router.navigate(['/app-login']);
        }
      });
    } else {
      console.error('❌ Impossible de charger l\'utilisateur');
      console.log('UserId:', userId, 'Token:', token);
      this.router.navigate(['/app-login']);
    }
  }
}

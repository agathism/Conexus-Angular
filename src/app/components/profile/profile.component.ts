import { Component, inject } from '@angular/core';
import User from '../../models/user.interface';
import { UserService } from '../../services/users/user-service';
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

  ngOnInit() {
    console.log('🔍 Initialisation du composant profile');
    console.log('📦 Token dans localStorage:', this.userService.getToken());
    console.log('👤 User dans localStorage:', this.userService.getUser());
    
    this.userService.currentUser$.subscribe(user => {
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
}

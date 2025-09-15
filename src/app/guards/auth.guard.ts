import { CanActivateFn, Router } from '@angular/router';
import { UserService } from '../services/users/user-service';
import { inject } from '@angular/core';

export const authGuard: CanActivateFn = (route, state) => {
  const userService = inject(UserService);
  const router = inject(Router);

  // Vérifier si l'utilisateur est authentifié
  if (userService.isAuthenticated()) {
    return true; // L'utilisateur peut accéder à la route
  } else {
    // Rediriger vers la page de connexion
    router.navigate(['/app-login']);
    return false; // Bloquer l'accès à la route
  }
};

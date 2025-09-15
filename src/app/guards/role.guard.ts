import { CanActivateFn, Router } from '@angular/router';
import { UserService } from '../services/users/user-service';
import { inject } from '@angular/core';

export const roleGuard: CanActivateFn = (route, state) => {
  const userService = inject(UserService);
  const router = inject(Router);

  // Vérifier d'abord si l'utilisateur est connecté
  if (!userService.isAuthenticated()) {
    router.navigate(['/app-login']);
    return false;
  }

  // Récupérer l'utilisateur actuel
  const currentUser = userService.getUser();

  if (!currentUser || !currentUser.roles) {
    router.navigate(['/app-unauthorized']);
    return false;
  }

  // 🔍 LOGS DE DEBUG - À SUPPRIMER APRÈS
  console.log('=== ROLE GUARD DEBUG ===');
  console.log('User roles:', currentUser.roles);
  console.log('Is owner (fonction):', userService.isOwner());
  console.log('Route data:', route.data);
  console.log('========================');

  // Vérifier si l'utilisateur est owner (accès à tout)
  const isOwner = userService.isOwner();
  if (isOwner) {
    console.log('✅ Accès autorisé : utilisateur owner');
    return true;
  }

  // Récupérer le rôle requis depuis les données de la route
  const requiredRole = route.data['requiredRole']; 

  // Vérifier si l'utilisateur a le rôle requis
  if (requiredRole && currentUser.roles.includes(requiredRole)) {
    console.log('✅ Accès autorisé : rôle requis trouvé');
    return true;
  }

  console.log('❌ Accès refusé');
  // Rediriger vers une page d'accès non autorisé
  router.navigate(['/app-unauthorized']);
  return false;
};

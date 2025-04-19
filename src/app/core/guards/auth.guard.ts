import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  
  if (authService.isLoggedIn()) {
    return true;
  }
  
  // Navigate to login page with return url
  router.navigate(['/auth/login'], { 
    queryParams: { returnUrl: state.url } 
  });
  
  return false;
};

export const adminGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  
  if (authService.isLoggedIn() && authService.hasRole('admin')) {
    return true;
  }
  
  if (!authService.isLoggedIn()) {
    // Navigate to login page if not logged in
    router.navigate(['/auth/login'], { 
      queryParams: { returnUrl: state.url } 
    });
  } else {
    // Navigate to forbidden page if logged in but not admin
    router.navigate(['/forbidden']);
  }
  
  return false;
};
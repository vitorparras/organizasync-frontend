import { Routes } from '@angular/router';
import { authGuard, adminGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  // Default redirect to login
  { path: '', redirectTo: '/auth/login', pathMatch: 'full' },

  // Auth routes
  {
    path: 'auth',
    children: [
      {
        path: 'login',
        loadComponent: () =>
          import('./features/auth/pages/login/login.component').then((m) => m.LoginComponent)
      }
    ]
  },

  // Dashboard routes with authentication guard and layout
  {
    path: 'dashboard',
    loadComponent: () =>
      import('./features/dashboard/layout/dashboard-layout.component').then(
        (m) => m.DashboardLayoutComponent
      ),
    // canActivate: [authGuard],
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./features/dashboard/pages/home/dashboard-home.component').then(
            (m) => m.DashboardHomeComponent
          )
      }
    ]
  },

  // Error routes
  {
    path: 'forbidden',
    loadComponent: () =>
      import('./features/error/forbidden/forbidden.component').then((m) => m.ForbiddenComponent)
  },
  {
    path: '**',
    loadComponent: () =>
      import('./features/error/not-found/not-found.component').then((m) => m.NotFoundComponent)
  }
];

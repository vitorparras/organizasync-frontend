import { Injectable, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { type Observable, catchError, finalize, map, of } from 'rxjs';
import { AuthRepository } from '@core/data-access/auth/auth.repository';
import type { LoginRequest } from '@core/domain/auth/models/auth.model';
import { ToastService } from '@shared/services/toast.service';

interface AuthState {
  user: {
    name: string;
    email: string;
  } | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private authRepository = inject(AuthRepository);
  private router = inject(Router);
  private toastService = inject(ToastService);

  // Estado da aplicação usando Signals
  private authStateSignal = signal<AuthState>({
    user: null,
    accessToken: localStorage.getItem('accessToken'),
    refreshToken: localStorage.getItem('refreshToken'),
    isAuthenticated: !!localStorage.getItem('accessToken'),
    isLoading: false,
    error: null,
  });

  // Expondo os Signals como readonly
  public authState = this.authStateSignal.asReadonly();

  login(credentials: LoginRequest): Observable<boolean> {
    this.authStateSignal.update(state => ({ ...state, isLoading: true, error: null }));

    return this.authRepository.login(credentials).pipe(
      map(response => {
        if (response.success && response.data) {
          this.authStateSignal.update(state => ({
            ...state,
            user: {
              name: response.data.name,
              email: response.data.email,
            },
            accessToken: response.data.accessToken,
            refreshToken: response.data.refreshToken,
            isAuthenticated: true,
            error: null,
          }));

          localStorage.setItem('accessToken', response.data.accessToken);
          localStorage.setItem('refreshToken', response.data.refreshToken);
          localStorage.setItem(
            'user',
            JSON.stringify({
              name: response.data.name,
              email: response.data.email,
            })
          );

          this.toastService.show({
            title: 'Bem-vindo',
            description: `Olá, ${response.data.name}!`,
            variant: 'default',
          });

          return true;
        } else {
          this.authStateSignal.update(state => ({
            ...state,
            error: response.message || 'Falha na autenticação',
          }));

          this.toastService.show({
            title: 'Erro de autenticação',
            description: response.message || 'Credenciais inválidas. Tente novamente.',
            variant: 'destructive',
          });

          return false;
        }
      }),
      catchError(error => {
        this.authStateSignal.update(state => ({
          ...state,
          error: 'Credenciais inválidas. Tente novamente.',
        }));

        this.toastService.show({
          title: 'Erro de autenticação',
          description: 'Credenciais inválidas. Tente novamente.',
          variant: 'destructive',
        });

        return of(false);
      }),
      finalize(() => {
        this.authStateSignal.update(state => ({ ...state, isLoading: false }));
      })
    );
  }

  logout(): void {
    const userId = this.getUserId();

    if (userId) {
      this.authRepository.logout({ userId }).subscribe();
    }

    // Limpa o estado e o token
    this.authStateSignal.update(state => ({
      ...state,
      user: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,
    }));

    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');

    // Redireciona para a página de login
    this.router.navigate(['/auth/login']);
  }

  refreshToken(): Observable<boolean> {
    const accessToken = this.authStateSignal().accessToken;
    const refreshToken = this.authStateSignal().refreshToken;

    if (!accessToken || !refreshToken) {
      return of(false);
    }

    return this.authRepository.refreshToken({ accessToken, refreshToken }).pipe(
      map(response => {
        if (response.success && response.data) {
          this.authStateSignal.update(state => ({
            ...state,
            accessToken: response.data.accessToken,
            refreshToken: response.data.refreshToken,
            isAuthenticated: true,
          }));

          localStorage.setItem('accessToken', response.data.accessToken);
          localStorage.setItem('refreshToken', response.data.refreshToken);

          return true;
        }
        return false;
      }),
      catchError(() => {
        this.logout();
        return of(false);
      })
    );
  }

  getToken(): string | null {
    return this.authStateSignal().accessToken;
  }

  isAuthenticated(): boolean {
    return this.authStateSignal().isAuthenticated;
  }

  getUserId(): string | null {
    // Extrair o ID do usuário do token JWT
    const token = this.authStateSignal().accessToken;
    if (!token) return null;

    try {
      const tokenPayload = JSON.parse(atob(token.split('.')[1]));
      return tokenPayload.sub || null;
    } catch (e) {
      return null;
    }
  }
}

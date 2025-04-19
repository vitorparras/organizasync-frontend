import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, catchError, map, of, tap } from 'rxjs';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  name: string; // Full name (firstName + lastName)
  roles: string[];
}

export interface LoginRequest {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface AuthResponse {
  user: User;
  token: string;
  refreshToken: string;
}

// Custom KeycloakProfile interface to avoid dependency issues
export interface KeycloakProfile {
  id?: string;
  username?: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  enabled?: boolean;
  emailVerified?: boolean;
  totp?: boolean;
  createdTimestamp?: number;
  [key: string]: any;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  
  currentUser$ = this.currentUserSubject.asObservable();
  isAuthenticated$ = this.currentUser$.pipe(map(user => !!user));
  
  private readonly AUTH_TOKEN_KEY = 'auth_token';
  private readonly REFRESH_TOKEN_KEY = 'auth_refresh_token';
  private readonly USER_KEY = 'auth_user';
  
  constructor(
    private http: HttpClient,
    private router: Router
  ) {
    // Try to restore user from localStorage on service initialization
    this.restoreAuthState();
  }
  
  login(loginRequest: LoginRequest): Observable<User> {
    return this.http.post<AuthResponse>(`${environment.apiUrl}/auth/login`, loginRequest)
      .pipe(
        tap(response => this.setAuthState(response)),
        map(response => response.user),
        catchError(error => {
          console.error('Login error:', error);
          throw new Error(error.error?.message || 'auth.loginFailed');
        })
      );
  }
  
  logout(): void {
    // Clear auth state
    this.clearAuthState();
    
    // Navigate to login page
    this.router.navigate(['/auth/login']);
  }
  
  isLoggedIn(): boolean {
    return !!this.currentUserSubject.value;
  }
  
  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }
  
  getAuthToken(): string | null {
    return localStorage.getItem(this.AUTH_TOKEN_KEY);
  }
  
  hasRole(role: string): boolean {
    const user = this.currentUserSubject.value;
    return !!user && user.roles.includes(role);
  }
  
  private setAuthState(authResponse: AuthResponse): void {
    // Store auth data in localStorage
    localStorage.setItem(this.AUTH_TOKEN_KEY, authResponse.token);
    localStorage.setItem(this.REFRESH_TOKEN_KEY, authResponse.refreshToken);
    localStorage.setItem(this.USER_KEY, JSON.stringify(authResponse.user));
    
    // Update current user
    this.currentUserSubject.next(authResponse.user);
  }
  
  private clearAuthState(): void {
    // Remove auth data from localStorage
    localStorage.removeItem(this.AUTH_TOKEN_KEY);
    localStorage.removeItem(this.REFRESH_TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
    
    // Update current user
    this.currentUserSubject.next(null);
  }
  
  private restoreAuthState(): void {
    try {
      const token = localStorage.getItem(this.AUTH_TOKEN_KEY);
      const userJson = localStorage.getItem(this.USER_KEY);
      
      if (token && userJson) {
        const user = JSON.parse(userJson) as User;
        this.currentUserSubject.next(user);
      }
    } catch (error) {
      console.error('Error restoring auth state:', error);
      this.clearAuthState();
    }
  }
}
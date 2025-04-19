import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { delay, tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { User, LoginRequest } from './auth.service';

/**
 * Mock authentication service for development
 * This service simulates authentication behavior without actual backend calls
 */
@Injectable({
  providedIn: 'root'
})
export class MockAuthService {
  private readonly AUTH_TOKEN_KEY = 'mock_auth_token';
  private readonly USER_KEY = 'mock_auth_user';
  
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  
  currentUser$ = this.currentUserSubject.asObservable();
  isAuthenticated$ = this.currentUser$;
  
  // Demo user credentials
  private readonly DEMO_EMAIL = 'demo@example.com';
  private readonly DEMO_PASSWORD = 'password123';
  
  // Demo user data
  private readonly DEMO_USER: User = {
    id: '1',
    email: this.DEMO_EMAIL,
    firstName: 'Demo',
    lastName: 'User',
    name: 'Demo User',
    roles: ['user', 'admin']
  };
  
  constructor(private router: Router) {
    console.log('Using MockAuthService for development');
    
    // Try to restore user from localStorage on service initialization
    this.restoreAuthState();
  }
  
  login(loginRequest: LoginRequest): Observable<User> {
    // Validate credentials
    if (loginRequest.email === this.DEMO_EMAIL && loginRequest.password === this.DEMO_PASSWORD) {
      // Simulate API delay
      return of(this.DEMO_USER).pipe(
        delay(800), // Add delay to simulate network request
        tap(user => {
          // Set auth state
          this.setAuthState(user);
        })
      );
    } else {
      // Return error for invalid credentials
      return throwError(() => new Error('auth.invalidCredentials'));
    }
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
  
  private setAuthState(user: User): void {
    // Generate mock token
    const mockToken = `mock-token-${Date.now()}`;
    
    // Store in localStorage
    localStorage.setItem(this.AUTH_TOKEN_KEY, mockToken);
    localStorage.setItem(this.USER_KEY, JSON.stringify(user));
    
    // Update current user
    this.currentUserSubject.next(user);
  }
  
  private clearAuthState(): void {
    // Remove from localStorage
    localStorage.removeItem(this.AUTH_TOKEN_KEY);
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
      console.error('Error restoring mock auth state:', error);
      this.clearAuthState();
    }
  }
}
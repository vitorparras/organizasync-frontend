import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401) {
          // Handle unauthorized errors (expired token, etc.)
          console.error('Unauthorized error:', error);
          this.handleUnauthorized();
        } else if (error.status === 403) {
          // Handle forbidden errors (insufficient permissions)
          console.error('Forbidden error:', error);
          this.router.navigate(['/forbidden']);
        } else if (error.status === 404) {
          // Handle not found errors
          console.error('Not found error:', error);
        } else if (error.status === 0) {
          // Handle network/connection errors
          console.error('Network/connection error:', error);
        } else {
          // Handle other errors
          console.error('HTTP error:', error);
        }
        
        // Propagate the error to the caller
        return throwError(() => error);
      })
    );
  }
  
  private handleUnauthorized(): void {
    // Check if the user is logged in
    if (this.authService.isLoggedIn()) {
      // If logged in, the token might be expired or invalid
      // So we should log out the user
      this.authService.logout();
    }
    
    // Redirect to login page
    this.router.navigate(['/auth/login']);
  }
}
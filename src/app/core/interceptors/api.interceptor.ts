import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { environment } from '../../../environments/environment';

/**
 * Intercepts HTTP requests to add API URL prefix and authentication token
 */
@Injectable()
export class ApiInterceptor implements HttpInterceptor {
  constructor(
    private authService: AuthService
  ) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    // Skip if the request is already using a full URL
    if (request.url.startsWith('http://') || request.url.startsWith('https://')) {
      return next.handle(request);
    }
    
    // Add API URL prefix if needed
    let apiRequest = request.clone({
      url: this.prependApiUrl(request.url)
    });
    
    // Add auth token if authenticated
    if (this.authService.isLoggedIn()) {
      const token = this.authService.getAuthToken();
      if (token) {
        apiRequest = apiRequest.clone({
          setHeaders: {
            Authorization: `Bearer ${token}`
          }
        });
      }
    }
    
    return next.handle(apiRequest);
  }
  
  private prependApiUrl(url: string): string {
    // Avoid double slashes when combining API URL and endpoint path
    const apiUrl = environment.apiUrl.endsWith('/') 
      ? environment.apiUrl.slice(0, -1) 
      : environment.apiUrl;
      
    const path = url.startsWith('/') ? url : `/${url}`;
    
    return `${apiUrl}${path}`;
  }
}
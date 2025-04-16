import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import type { Observable } from 'rxjs';
import { environment } from '@environments/environment';
import type {
  ApiResponse,
  AuthResponse,
  LoginRequest,
  LogoutRequest,
  RefreshTokenRequest,
} from '@core/domain/auth/models/auth.model';

@Injectable({
  providedIn: 'root',
})
export class AuthRepository {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/api/Auth`;

  login(request: LoginRequest): Observable<ApiResponse<AuthResponse>> {
    return this.http.post<ApiResponse<AuthResponse>>(`${this.apiUrl}/Login`, request);
  }

  logout(request: LogoutRequest): Observable<ApiResponse<boolean>> {
    return this.http.post<ApiResponse<boolean>>(`${this.apiUrl}/Logout`, request);
  }

  refreshToken(request: RefreshTokenRequest): Observable<ApiResponse<AuthResponse>> {
    return this.http.post<ApiResponse<AuthResponse>>(`${this.apiUrl}/Refresh`, request);
  }
}

import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import type { Observable } from 'rxjs';
import { environment } from '@environments/environment';
import type {
  ApiResponse,
  ChangePasswordRequest,
  CreateUserRequest,
  UpdateUserRequest,
  User,
} from '@core/domain/users/models/user.model';

@Injectable({
  providedIn: 'root',
})
export class UserRepository {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/api/Users`;

  getById(id: string): Observable<ApiResponse<User>> {
    return this.http.get<ApiResponse<User>>(`${this.apiUrl}/GetById/${id}`);
  }

  create(request: CreateUserRequest): Observable<ApiResponse<User>> {
    return this.http.post<ApiResponse<User>>(`${this.apiUrl}/Create`, request);
  }

  update(request: UpdateUserRequest): Observable<ApiResponse<User>> {
    return this.http.put<ApiResponse<User>>(`${this.apiUrl}/Update`, request);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/Delete/${id}`);
  }

  changePassword(request: ChangePasswordRequest): Observable<ApiResponse<any>> {
    return this.http.post<ApiResponse<any>>(`${this.apiUrl}/ChangePassword`, request);
  }
}

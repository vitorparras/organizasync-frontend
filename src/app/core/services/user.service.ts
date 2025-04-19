import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { API_ENDPOINTS } from '../constants/api-endpoints.constant';
import { ChangeUserPasswordCommand, CreateUserCommand, UpdateUserCommand, User } from '../models/user.model';
import { GenericResponse, ObjectGenericResponse } from '../models/api-response.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  
  constructor(private http: HttpClient) { }
  
  /**
   * Get user by ID
   */
  getUserById(id: string): Observable<User> {
    return this.http.get<GenericResponse<User>>(`${API_ENDPOINTS.USERS.GET_BY_ID}/${id}`)
      .pipe(
        map(response => {
          if (response.success) {
            return response.data;
          } else {
            throw new Error(response.message || 'Failed to get user');
          }
        }),
        catchError(error => {
          console.error('Error getting user:', error);
          return throwError(() => error);
        })
      );
  }
  
  /**
   * Create new user
   */
  createUser(command: CreateUserCommand): Observable<User> {
    return this.http.post<ObjectGenericResponse>(API_ENDPOINTS.USERS.CREATE, command)
      .pipe(
        map(response => {
          if (response.success) {
            return response.data;
          } else {
            throw new Error(response.message || 'Failed to create user');
          }
        }),
        catchError(error => {
          console.error('Error creating user:', error);
          return throwError(() => error);
        })
      );
  }
  
  /**
   * Update existing user
   */
  updateUser(command: UpdateUserCommand): Observable<User> {
    return this.http.put<ObjectGenericResponse>(API_ENDPOINTS.USERS.UPDATE, command)
      .pipe(
        map(response => {
          if (response.success) {
            return response.data;
          } else {
            throw new Error(response.message || 'Failed to update user');
          }
        }),
        catchError(error => {
          console.error('Error updating user:', error);
          return throwError(() => error);
        })
      );
  }
  
  /**
   * Delete user by ID
   */
  deleteUser(id: string): Observable<void> {
    return this.http.delete<void>(`${API_ENDPOINTS.USERS.DELETE}/${id}`)
      .pipe(
        catchError(error => {
          console.error('Error deleting user:', error);
          return throwError(() => error);
        })
      );
  }
  
  /**
   * Change user password
   */
  changePassword(command: ChangeUserPasswordCommand): Observable<boolean> {
    return this.http.post<ObjectGenericResponse>(API_ENDPOINTS.USERS.CHANGE_PASSWORD, command)
      .pipe(
        map(response => {
          if (response.success) {
            return true;
          } else {
            throw new Error(response.message || 'Failed to change password');
          }
        }),
        catchError(error => {
          console.error('Error changing password:', error);
          return throwError(() => error);
        })
      );
  }
}

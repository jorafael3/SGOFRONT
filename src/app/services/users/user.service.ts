import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseApiService } from '../base-api.service';
import { UserProfile, CreateUserRequest, UpdateUserRequest, UserListResponse } from '../../models/user.model';
import { ApiResponse } from '../../models/auth.model';

@Injectable({
  providedIn: 'root'
})
export class UserService extends BaseApiService {

  private readonly endpoint = '/users';

  /**
   * Get all users with pagination
   */
  getUsers(page: number = 1, limit: number = 10, search?: string): Observable<ApiResponse<UserListResponse>> {
    let queryParams = `?page=${page}&limit=${limit}`;
    if (search) {
      queryParams += `&search=${encodeURIComponent(search)}`;
    }
    return this.get<ApiResponse<UserListResponse>>(`${this.endpoint}${queryParams}`);
  }

  /**
   * Get user by ID
   */
  getUserById(id: number): Observable<ApiResponse<UserProfile>> {
    return this.get<ApiResponse<UserProfile>>(`${this.endpoint}/${id}`);
  }

  /**
   * Create new user
   */
  createUser(userData: CreateUserRequest): Observable<ApiResponse<UserProfile>> {
    return this.post<ApiResponse<UserProfile>>(this.endpoint, userData);
  }

  /**
   * Update user
   */
  updateUser(id: number, userData: UpdateUserRequest): Observable<ApiResponse<UserProfile>> {
    return this.put<ApiResponse<UserProfile>>(`${this.endpoint}/${id}`, userData);
  }

  /**
   * Delete user
   */
  deleteUser(id: number): Observable<ApiResponse<any>> {
    return this.delete<ApiResponse<any>>(`${this.endpoint}/${id}`);
  }

  /**
   * Get current user profile
   */
  getCurrentUserProfile(): Observable<ApiResponse<UserProfile>> {
    return this.get<ApiResponse<UserProfile>>(`${this.endpoint}/profile`);
  }

  /**
   * Update current user profile
   */
  updateCurrentUserProfile(userData: UpdateUserRequest): Observable<ApiResponse<UserProfile>> {
    return this.put<ApiResponse<UserProfile>>(`${this.endpoint}/profile`, userData);
  }

  /**
   * Change user password
   */
  changePassword(currentPassword: string, newPassword: string): Observable<ApiResponse<any>> {
    return this.put<ApiResponse<any>>(`${this.endpoint}/change-password`, {
      currentPassword,
      newPassword
    });
  }

  /**
   * Upload user avatar
   */
  uploadAvatar(id: number, file: File): Observable<ApiResponse<any>> {
    const formData = new FormData();
    formData.append('avatar', file);
    
    // Note: This would need a special method in BaseApiService for file uploads
    // or handle it differently since it's not JSON
    return this.post<ApiResponse<any>>(`${this.endpoint}/${id}/avatar`, formData);
  }
}

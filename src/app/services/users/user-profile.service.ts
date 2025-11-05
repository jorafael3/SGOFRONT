import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { AuthService } from '../auth/auth.service';
import { User } from '../../models/auth.model';

@Injectable({
  providedIn: 'root'
})
export class UserProfileService {
  
  private userProfileSubject = new BehaviorSubject<User | null>(null);
  public userProfile$ = this.userProfileSubject.asObservable();

  constructor(private authService: AuthService) {
    // Suscribirse a cambios del usuario actual
    this.authService.currentUser$.subscribe(user => {
      this.userProfileSubject.next(user);
    });
  }

  /**
   * Get current user profile
   */
  getCurrentProfile(): User | null {
    return this.userProfileSubject.value;
  }

  /**
   * Get user display name
   */
  getDisplayName(): string {
    const user = this.getCurrentProfile();
    return user ? user.name : 'Usuario';
  }

  /**
   * Get user role display name
   */
  getRoleDisplayName(): string {
    const user = this.getCurrentProfile();
    return user?.role || 'Sin rol';
  }

  /**
   * Check if user has specific role
   */
  hasRole(roleId: number): boolean {
    const user = this.getCurrentProfile();
    return user?.id_rol === roleId;
  }

  /**
   * Check if user is admin
   */
  isAdmin(): boolean {
    return this.hasRole(1); // Asumiendo que rol 1 es admin
  }

  /**
   * Get user company ID
   */
  getCompanyId(): number | null {
    const user = this.getCurrentProfile();
    return user?.id_empresa || null;
  }

  /**
   * Get user avatar or initials
   */
  getAvatarOrInitials(): string {
    const user = this.getCurrentProfile();
    if (user) {
      // Si no hay avatar, usar iniciales
      const names = user.name.split(' ');
      return names.map(name => name.charAt(0)).join('').toUpperCase();
    }
    return 'U';
  }
}

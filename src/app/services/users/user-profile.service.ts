import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../auth/auth.service';
import { User } from '../../models/auth.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserProfileService {

  private userProfileSubject = new BehaviorSubject<User | null>(null);
  public userProfile$ = this.userProfileSubject.asObservable();

  private readonly endpoint = environment.apiUrl + '/recursoshumanos/empleados/';

  constructor(
    private authService: AuthService,
    private http: HttpClient
  ) {
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

  /**
   * Obtener datos personales del empleado
   * @param empleadoId - ID del empleado
   */
  getDatosPersonales(empleadoId: string): Observable<any> {
    const payload = { empleadoId: empleadoId };
    console.log('📤 [getDatosPersonales] Enviando al backend:', payload);
    console.log('📍 [getDatosPersonales] URL:', this.endpoint + 'GetDatosPersonales');
    return this.http.post<any>(this.endpoint + 'GetDatosPersonales', payload);
  }

  /**
   * Obtener cargas familiares del empleado
   * @param empleadoId - ID del empleado
   */
  getCargasFamiliares(empleadoId: string): Observable<any> {
    const payload = { empleadoId: empleadoId };
    console.log('📤 [getCargasFamiliares] Enviando al backend:', payload);
    console.log('📍 [getCargasFamiliares] URL:', this.endpoint + 'GetCargasFamiliares');
    return this.http.post<any>(this.endpoint + 'GetCargasFamiliares', payload);
  }

  /**
   * Obtener historial de vacaciones del empleado
   * @param empleadoId - ID del empleado
   */
  getVacaciones(empleadoId: string): Observable<any> {
    const payload = { empleadoId: empleadoId };
    console.log('📤 [getVacaciones] Enviando al backend:', payload);
    console.log('📍 [getVacaciones] URL:', this.endpoint + 'GetVacaciones');
    return this.http.post<any>(this.endpoint + 'GetVacaciones', payload);
  }
}

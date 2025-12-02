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

  /**
   * Enviar solicitud de actualización de datos
   * @param solicitud - Datos de la solicitud
   */
  enviarSolicitudActualizacion(solicitud: any): Observable<any> {
    console.log('📤 [enviarSolicitudActualizacion] Enviando al backend:', solicitud);
    console.log('📍 [enviarSolicitudActualizacion] URL:', this.endpoint + 'SolicitudActualizacionDatos');
    return this.http.post<any>(this.endpoint + 'SolicitudActualizacionDatos', solicitud);
  }

  /**
   * Actualizar datos personales del empleado
   * @param datos - Datos personales a actualizar
   */
  actualizarDatosPersonales(datos: any): Observable<any> {
    console.log('📤 [actualizarDatosPersonales] Enviando al backend:', datos);
    console.log('📍 [actualizarDatosPersonales] URL:', this.endpoint + 'ActualizarDatosPersonales');
    return this.http.post<any>(this.endpoint + 'ActualizarDatosPersonales', datos);
  }

  /**
  * Actualizar CARGAS  del empleado
  * @param datos - Datos actualizarcargasempleado
  */
  actualizarcargasempleado(datos: any): Observable<any> {
    console.log('📤 [actualizarcargasempleado] Enviando al backend:', datos);
    console.log('📍 [actualizarcargasempleado] URL:', this.endpoint + 'ActualizarCargasEmpleado');
    return this.http.post<any>(this.endpoint + 'ActualizarCargasEmpleado', datos);
  }



  /**
 * Agregar titulos y certificados  
 * @param datos - Datos actualizarcargasempleado
 */
  actualizarestudios(datos: any): Observable<any> {
    console.log('📤 [actualizarestudios] Enviando al backend:', datos);
    console.log('📍 [actualizarestudios] URL:', this.endpoint + 'ActualizarEstudios');
    return this.http.post<any>(this.endpoint + 'ActualizarEstudios', datos);
  }



  /**
  * Obtener cargar estudios 
  * @param empleadoId - ID del empleado
  */
  getCargasEstudios(empleadoId: string): Observable<any> {
    const payload = { empleadoId: empleadoId };
    console.log('📤 [getCargasEstudios] Enviando al backend:', payload);
    console.log('📍 [getCargasEstudios] URL:', this.endpoint + 'GetCargasEstudios');
    return this.http.post<any>(this.endpoint + 'GetCargasEstudios', payload);
  }


   /**
 * Agregar titulos y certificados  
 * @param datos - Datos actualizarcargasempleado
 */
  actualizarenfermedades(datos: any): Observable<any> {
    console.log('📤 [actualizarenfermedades] Enviando al backend:', datos);
    console.log('📍 [actualizarenfermedades] URL:', this.endpoint + 'ActualizarEnfermedades');
    return this.http.post<any>(this.endpoint + 'ActualizarEnfermedades', datos);
  }


 /**
 * Obtener enfermedades
 * @param datos -
 */
  getenfermedades(datos: any): Observable<any> {
    console.log('📤 [getenfermedades] Enviando al backend:', datos);
    console.log('📍 [getenfermedades] URL:', this.endpoint + 'Getenfermedades');
    return this.http.post<any>(this.endpoint + 'Getenfermedades', datos);
  }

}

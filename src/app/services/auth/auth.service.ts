import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject, tap, of, catchError, finalize } from 'rxjs';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { BaseApiService } from '../base-api.service';
import { LoginRequest, LoginResponse, User } from '../../models/auth.model';
import { RoleService } from '../../config/roles.config';

@Injectable({
  providedIn: 'root'
})
export class AuthService extends BaseApiService {
  
  // Modo testing temporal - cambiar a false cuando tengas la API lista
  private readonly TESTING_MODE = false;
  
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();
  
  private isLoggedInSubject = new BehaviorSubject<boolean>(false);
  public isLoggedIn$ = this.isLoggedInSubject.asObservable();

  constructor(http: HttpClient, private router: Router) {
    super(http);
    this.checkCurrentUser();
  }

  /**
   * Login user with username and password
   */
  login(credentials: LoginRequest): Observable<LoginResponse> {
    console.log('Login attempt with credentials:', credentials);
    
    if (this.TESTING_MODE) {
      // Modo testing - simular login exitoso
      const mockResponse: LoginResponse = {
        success: true,
        message: 'Login exitoso (modo testing)',
        user_data: {
          id_usuario: 1,
          id_empresa: 1,
          id_rol: 2,
          usuario: credentials.username,
          nombre: 'Usuario Test',
          apellido: 'Test',
          telefono: '0999999999',
          email: credentials.username + '@test.com',
          estado: 'A',
          creado_por: 'admin',
          fecha_creacion: new Date().toISOString(),
          token: 'fake-jwt-token-for-testing-' + Date.now()
        }
      };
      
      console.log('Mock response:', mockResponse);
      
      // Simular la respuesta con un pequeño delay
      return of(mockResponse).pipe(
        tap(response => {
          if (response.success && response.user_data) {
            const user = this.mapApiUserToUser(response.user_data);
            this.setUserSession(user, response.user_data.token);
          }
        })
      );
    } else {
      // Modo producción - usar API real
      return this.post<LoginResponse>('/login/login/authenticate', credentials).pipe(
        tap(response => {
          console.log('API response:', response);
          if (response.success && response.user_data) {
            // const user = this.mapApiUserToUser(response.user_data);
            this.setUserSession(response.user_data, response.user_data.token);
          }
        })
      );
    }
  }

  /**
   * Map API user data to internal User interface
   */
  private mapApiUserToUser(apiUser: any) {
    return {
      id: apiUser.usrid,
      username: apiUser.usuario,
      email: apiUser.email,
      name: `${apiUser.nombre}`,
      role: this.getRoleName(apiUser.id_rol),
      id_empresa: apiUser.empleado_empresa,
      id_empleado: apiUser.EmpleadoID,
      id_rol: apiUser.id_rol,
      estado: apiUser.anulado
    };
  }

  /**
   * Get role name based on role ID (customize as needed)
   */
  private getRoleName(idRol: number): string {
    return RoleService.getRoleDisplayName(idRol);
  }

  /**
   * Logout user
   */
  logout(): Observable<any> {
    console.log('Logging out user...');
    
    // Siempre limpiar la sesión local primero
    const currentUser = this.getCurrentUser();
    this.clearUserSession();
    
    // Intentar notificar al servidor (opcional, puede fallar)
    return this.post('/login/logout', { 
      user_id: currentUser?.id 
    }).pipe(
      tap({
        next: (response) => {
          console.log('Server logout response:', response);
        },
        error: (error) => {
          console.warn('Server logout failed, but local session cleared:', error);
        },
        finalize: () => {
          // Asegurar navegación al login
          console.log('Navigating to login page...');
          this.router.navigate(['/auth/login']);
        }
      }),
      // Convertir errores en éxito porque la sesión local ya está limpia
      catchError(error => {
        console.warn('Logout API error (ignoring):', error);
        return of({ success: true, message: 'Sesión cerrada localmente' });
      })
    );
  }

  /**
   * Register new user
   */
  register(userData: any): Observable<any> {
    return this.post('/auth/register', userData);
  }

  /**
   * Refresh authentication token
   */
  refreshToken(): Observable<LoginResponse> {
    const refreshToken = localStorage.getItem('refreshToken');
    return this.post<LoginResponse>('/auth/refresh', { refreshToken }).pipe(
      tap(response => {
        if (response.success && response.user_data) {
          const user = this.mapApiUserToUser(response.user_data);
          this.setUserSession(user, response.user_data.token);
        }
      })
    );
  }

  /**
   * Forgot password
   */
  forgotPassword(email: string): Observable<any> {
    return this.post('/auth/forgot-password', { email });
  }

  /**
   * Reset password
   */
  resetPassword(token: string, newPassword: string): Observable<any> {
    return this.post('/auth/reset-password', { token, newPassword });
  }

  /**
   * Get current user
   */
  getCurrentUser(): any | null {
    return this.currentUserSubject.value;
  }

  /**
   * Check if user is logged in
   */
  isLoggedIn(): boolean {
    return this.isLoggedInSubject.value;
  }

  /**
   * Set user session data
   */
  private setUserSession(user: any, token: string, refreshToken?: string): void {
    console.log('Setting user session:', { user, token });
    
    localStorage.setItem('user', JSON.stringify(user));
    localStorage.setItem('authToken', token);
    
    if (refreshToken) {
      localStorage.setItem('refreshToken', refreshToken);
    }

    this.currentUserSubject.next(user);
    this.isLoggedInSubject.next(true);
    
    console.log('User session set successfully. IsLoggedIn:', this.isLoggedIn());
    console.log('Current user:', this.getCurrentUser());
  }

  /**
   * Clear user session data
   */
  private clearUserSession(): void {
    localStorage.removeItem('user');
    localStorage.removeItem('authToken');
    localStorage.removeItem('refreshToken');
    
    this.currentUserSubject.next(null);
    this.isLoggedInSubject.next(false);
  }

  /**
   * Check if user is already logged in (on app initialization)
   */
  private checkCurrentUser(): void {
    const userStr = localStorage.getItem('user');
    const token = localStorage.getItem('authToken');
    
    if (userStr && token) {
      try {
        const user = JSON.parse(userStr);
        this.currentUserSubject.next(user);
        this.isLoggedInSubject.next(true);
      } catch (error) {
        console.error('Error parsing user data:', error);
        this.clearUserSession();
      }
    }
  }
}

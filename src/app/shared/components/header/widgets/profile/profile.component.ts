import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../../../services/auth/auth.service';
import { UserProfileService } from '../../../../../services/users/user-profile.service';

import { FeatherIconComponent } from "../../../ui/feather-icon/feather-icon.component";
import { profile } from '../../../../data/header';
import { UsuariosService } from '../../../../../services/mantenimiento/usuarios.service';


@Component({
  selector: 'app-profile',
  imports: [CommonModule, RouterModule, FeatherIconComponent],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})

export class ProfileComponent {

  public profile = profile;
  DatosUsuario: any = {};

  constructor(
    private router: Router,
    private authService: AuthService,
    public userProfileService: UserProfileService,
    private UsuariosService: UsuariosService
  ) {

    this.GetUserData();
  }

  GetUserData() {
    this.DatosUsuario = this.UsuariosService.getUserSessionData();
    console.log('this.DatosUsuario: ', this.DatosUsuario);
  }


  logOut() {
    console.log('Logging out user...');

    // Usar el servicio de autenticación para logout
    this.authService.logout().subscribe({
      next: () => {
        console.log('Logout successful');
        // Forzar limpieza completa del caché
        this.clearAllCache();
      },
      error: (error) => {
        console.error('Logout error:', error);
        // Incluso si hay error en la API, limpiar sesión local
        this.forceLogout();
      }
    });
  }

  /**
   * Limpiar todo el caché del navegador
   */
  private clearAllCache() {
    // Limpiar localStorage
    localStorage.clear();

    // Limpiar sessionStorage
    sessionStorage.clear();

    // Detectar la ruta base del proyecto
    const basePath = this.getBasePath();
    
    // Forzar recarga completa de la página para limpiar caché en memoria
    window.location.href = `${basePath}/auth/login`;
  }

  /**
   * Obtener la ruta base del proyecto
   */
  private getBasePath(): string {
    // Obtener la ruta actual del navegador
    const pathname = window.location.pathname;
    
    // Buscar si hay SGONUEVO u otra carpeta en la ruta
    const pathSegments = pathname.split('/').filter(seg => seg);
    
    // Si hay más de un segmento, es probable que esté en una subcarpeta
    if (pathSegments.length > 0) {
      // Verificar si el último segmento es un archivo (tiene punto)
      const lastSegment = pathSegments[pathSegments.length - 1];
      if (lastSegment && !lastSegment.includes('.')) {
        // Retornar todos los segmentos excepto el último (que es la ruta actual)
        return '/' + pathSegments.slice(0, -1).join('/');
      }
    }
    
    // Por defecto, asumir que está en la raíz
    return '';
  }

  /**
   * Forzar logout en caso de error
   */
  private forceLogout() {
    this.clearAllCache();
  }

  /**
   * Obtener nombre del usuario actual
   */
  getCurrentUserName(): string {
    return this.userProfileService.getDisplayName();
  }

  /**
   * Obtener iniciales del usuario para avatar
   */
  getUserInitials(): string {
    return this.userProfileService.getAvatarOrInitials();
  }

  /**
   * Obtener rol del usuario
   */
  getUserRole(): string {
    return this.userProfileService.getRoleDisplayName();
  }

}

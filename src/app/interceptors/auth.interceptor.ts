import { inject } from '@angular/core';
import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth/auth.service';
import { catchError, throwError } from 'rxjs';
import Swal from 'sweetalert2';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const authService = inject(AuthService);

  // Add auth header if token exists
  const token = localStorage.getItem('authToken');
  if (token) {
    req = req.clone({
      setHeaders: {
        'Authorization': `Bearer ${token}`
      }
    });
  }

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      console.log('🔍 Interceptor detectó error:', error.status, error.message);
      
      // Detectar token expirado o no autorizado
      if (error.status === 401 || error.status === 403) {
        console.log('🔒 Token expirado detectado por interceptor');
        handleTokenExpired(router);
        return throwError(() => error);
      }
      
      // Para otros errores, pasarlos tal como están
      return throwError(() => error);
    })
  );
};

function handleTokenExpired(router: Router): void {
  console.log('🔒 Manejando token expirado...');
  
  // Mostrar mensaje al usuario
  Swal.fire({
    title: '🔒 Sesión Expirada',
    html: `
      <div class="text-center">
        <p class="text-warning"><i class="fa fa-clock fa-2x mb-2"></i></p>
        <p>Tu sesión ha caducado por seguridad.</p>
        <p class="text-muted">Serás redirigido al login para iniciar una nueva sesión.</p>
      </div>
    `,
    icon: 'warning',
    timer: 4000,
    timerProgressBar: true,
    showConfirmButton: false,
    allowOutsideClick: false,
    allowEscapeKey: false,
    background: '#ffffff',
    color: '#212529'
  }).then(() => {
    performLogout(router);
  });

  // También ejecutar logout después de 4 segundos por si acaso
  setTimeout(() => {
    performLogout(router);
  }, 4000);
}

function performLogout(router: Router): void {
  console.log('🧹 Limpiando sesión...');
  
  // Limpiar todo el caché
  localStorage.clear();
  sessionStorage.clear();
  
  // Forzar recarga completa para limpiar estado de Angular
  window.location.href = '/auth/login';
}

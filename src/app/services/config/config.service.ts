import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ConfigService {
  
  private apiUrl: string;

  constructor() {
    this.apiUrl = this.detectApiUrl();
  }

  /**
   * Obtener URL de API actual
   */
  getApiUrl(): string {
    return this.apiUrl;
  }

  /**
   * Detectar URL de API automáticamente
   */
  private detectApiUrl(): string {
    const hostname = window.location.hostname;
    const protocol = window.location.protocol;
    
    // Configuraciones por entorno
    const environments: { [key: string]: string } = {
      'localhost': `${protocol}//localhost/plantillaMVC`,
      '127.0.0.1': `${protocol}//127.0.0.1/plantillaMVC`,
      '10.5.3.172': `${protocol}//10.5.3.172/plantillaMVC`,
      // Producción
      'tu-dominio.com': 'https://api.tu-dominio.com'
    };

    return environments[hostname] || `${protocol}//${hostname}/plantillaMVC`;
  }

  /**
   * Actualizar URL de API manualmente
   */
  setApiUrl(url: string): void {
    this.apiUrl = url;
  }

  /**
   * Obtener información del entorno actual
   */
  getEnvironmentInfo() {
    return {
      hostname: window.location.hostname,
      protocol: window.location.protocol,
      port: window.location.port,
      apiUrl: this.apiUrl,
      isLocal: this.isLocalEnvironment()
    };
  }

  /**
   * Verificar si estamos en entorno local
   */
  private isLocalEnvironment(): boolean {
    const hostname = window.location.hostname;
    return hostname === 'localhost' || 
           hostname === '127.0.0.1' || 
           hostname.startsWith('192.168.') ||
           hostname.startsWith('10.');
  }
}

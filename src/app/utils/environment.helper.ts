export class EnvironmentHelper {
  
  /**
   * Detectar la IP local del servidor de desarrollo
   */
  static getLocalIP(): string {
    // Para desarrollo local, usar localhost
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
      return 'http://localhost';
    }
    
    // Si está corriendo en red local, usar la IP actual
    return `http://${window.location.hostname}`;
  }

  /**
   * Construir URL de API dinámicamente
   */
  static buildApiUrl(): string {
    const baseUrl = this.getLocalIP();
    const port = this.getApiPort();
    const path = '/plantillaMVC';
    
    return port ? `${baseUrl}:${port}${path}` : `${baseUrl}${path}`;
  }

  /**
   * Obtener puerto de API (configurar según tu setup)
   */
  static getApiPort(): string | null {
    // Si tu API corre en un puerto específico
    const hostname = window.location.hostname;
    
    if (hostname === 'localhost' || hostname === '127.0.0.1') {
      return '80'; // o el puerto que uses localmente
    }
    
    // Para redes locales, asumir puerto 80 (o configurar según necesites)
    return null;
  }

  /**
   * Detectar si estamos en producción
   */
  static isProduction(): boolean {
    return window.location.hostname !== 'localhost' && 
           window.location.hostname !== '127.0.0.1' &&
           !window.location.hostname.startsWith('192.168.') &&
           !window.location.hostname.startsWith('10.');
  }
}

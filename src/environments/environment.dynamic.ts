// Configuración usando variables de entorno
// Puedes configurar estas variables según tu entorno

export const environment = {
  production: false,
  apiUrl: getApiUrlFromEnv()
};

function getApiUrlFromEnv(): string {
  // Opción 1: Usar hostname actual
  if (typeof window !== 'undefined') {
    const hostname = window.location.hostname;
    return `http://${hostname}/SGOBACK`;
  }
  
  // Opción 2: Variables de entorno (si las configuras)
  // return process.env['API_URL'] || 'http://localhost/plantillaMVC';
  
  // Fallback
  return 'http://localhost/SGOBACK';
}

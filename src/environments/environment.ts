// Configuración dinámica de API URL
function getApiUrl(): string {
  if (typeof window === 'undefined') {
    return 'http://localhost/SGOBACK'; // Fallback para SSR
  }

  const hostname = window.location.hostname;
  console.log('hostname: ', hostname);


  // Configuraciones específicas por hostname
  const configurations: { [key: string]: string } = {
    // 'localhost': 'http://localhost/plantillaMVC',
    '127.0.0.1': 'http://127.0.0.1/SGOBACK',
    '10.5.3.172:8080': 'http://10.5.3.172:8080/SGOBACK',
    // Agregar más configuraciones según necesites
  };

  // Si hay una configuración específica, usarla
  if (configurations[hostname]) {


    return configurations[hostname];
  }

  if (hostname == '10.5.3.172') {
    return `http://${hostname}:8080/SGOBACK`;
  }

  // Por defecto, usar el hostname actual
  return `http://${hostname}:8080/SGOBACK`;
}

export const environment = {
  production: false,
  apiUrl: getApiUrl()
  // apiUrl:'http://10.5.3.172:8080/plantillaMVC'
};


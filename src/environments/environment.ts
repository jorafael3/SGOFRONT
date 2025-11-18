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
  return `http://${hostname}/SGOBACK`;
}

function getSgoDocsBase(): string {
  if (typeof window === 'undefined') {
    return 'http://localhost/sgo_docs/Cartimex/oym/mpps'; // Fallback para SSR
  }

  const hostname = window.location.hostname;
  console.log('hostname: ', hostname);

  // Configuraciones específicas por hostname
  const configurations: { [key: string]: string } = {
    '127.0.0.1': 'http://127.0.0.1/sgo_docs/Cartimex/oym/mpps',
    '10.5.3.172:8080': 'http://10.5.3.172:8080/sgo_docs/Cartimex/oym/mpps',
    // Agregar más configuraciones según necesites
  };

  // Si hay una configuración específica, usarla
  if (configurations[hostname]) {
    return configurations[hostname];
  }

  if (hostname == '10.5.3.172') {
    return `http://${hostname}:8080/sgo_docs/Cartimex/oym/mpps`;
  }

  // Por defecto, usar el hostname actual
  return `http://${hostname}/sgo_docs/Cartimex/oym/mpps`;
}

export const environment = {
  production: false,
  apiUrl: getApiUrl(),
  sgo_docs_base: getSgoDocsBase(),
  // apiUrl:'http://10.5.3.172:8080/plantillaMVC'
};


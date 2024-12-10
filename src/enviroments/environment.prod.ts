export const environment = {
  // SERVER_URL: '',
  production: true,
  useHash: true,
  hmr: false,

  // apiUrl: 'http://localhost:30040/api/hero'
  SERVER_URL_SECURITY_AUTH: process['env']['SERVER_URL_SECURITY_AUTH'] || 'https://banobras-security-auth-common-apps-develop.banobras.gob.mx',
  //SERVER_URL_SECURITY_AUTH: 'https://banobras-security-auth-common-apps-develop.banobras.gob.mx',

  SERVER_URL_API_TOKENIZER: process['env']['SERVER_URL_API_TOKENIZER'] || 'https://banobras-api-tokenizer-common-apps-develop.banobras.gob.mx',
  //SERVER_URL_API_TOKENIZER: 'https://banobras-api-tokenizer-common-apps-develop.banobras.gob.mx',

  //Bitacoras
  SERVER_URL_BITACORA: process['env']['SERVER_URL_BITACORA'] || 'https://backend-business-centralized-logs-develop.banobras.gob.mx',
  //SERVER_URL_BITACORA: 'https://backend-business-centralized-logs-develop.banobras.gob.mx',

  BITACORA_identificador: 0,
  BITACORA_aplicativoId: 'BITACORAS',
  BITACORA_consumerId: 'UI BITACORAS',
  BITACORA_capa: 'Frontend',
};





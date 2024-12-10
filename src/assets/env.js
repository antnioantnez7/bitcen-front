(function (process) {
  process['env'] = process['env'] || {};
  // Environment variables
  process['env'][' SERVER_URL_SECURITY_AUTH'] = 'https://banobras-security-auth-common-apps-develop.banobras.gob.mx';
  process['env']['SERVER_URL_API_TOKENIZER'] || 'https://banobras-api-tokenizer-common-apps-develop.banobras.gob.mx';
  process['env']['SERVER_URL_BITACORA'] || 'https://backend-business-centralized-logs-develop.banobras.gob.mx';
})(this);

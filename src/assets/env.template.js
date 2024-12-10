(function (process) {
  process['env'] = process['env'] || {};
  // Environment variables
  process['env']['SERVER_URL_SECURITY_AUTH'] = '${SERVER_URL_SECURITY_AUTH}';
  process['env']['SERVER_URL_API_TOKENIZER'] = '${SERVER_URL_API_TOKENIZER}';
  process['env']['SERVER_URL_BITACORA'] = '${SERVER_URL_BITACORA}';
})(this);

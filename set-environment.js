const fs = require('fs');
const path = require('path');

// Obtener las variables de entorno
const  SERVER_URL_SECURITY_AUTH = process.env.SERVER_URL_SECURITY_AUTH || ' SERVER_URL_SECURITY_AUTH';
const SERVER_URL_API_TOKENIZER = process.env.SERVER_URL_API_TOKENIZER || 'SERVER_URL_API_TOKENIZER';
const SERVER_URL_BITACORA = process.env.SERVER_URL_BITACORA || 'SERVER_URL_BITACORA';

// Ruta al archivo environment.ts
const envFilePath = path.resolve(__dirname, 'src/environments/environment.ts');

// Leer el archivo environment.ts
let environmentFile = fs.readFileSync(envFilePath, 'utf8');

// Reemplazar las variables
environmentFile = environmentFile.replace(/'SERVER_URL_SECURITY_AUTH': '.*?'/, `'SERVER_URL_SECURITY_AUTH': '${SERVER_URL_SECURITY_AUTH}'`);
environmentFile = environmentFile.replace(/'SERVER_URL_API_TOKENIZER': '.*?'/, `'SERVER_URL_API_TOKENIZER': '${SERVER_URL_API_TOKENIZER}'`);
environmentFile = environmentFile.replace(/'SERVER_URL_BITACORA': '.*?'/, `'SERVER_URL_BITACORA': '${SERVER_URL_BITACORA}'`);

// Guardar los cambios
fs.writeFileSync(envFilePath, environmentFile);

console.log('Environment variables updated in environment.ts');

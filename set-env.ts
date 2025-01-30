const { writeFileSync } = require('fs');
const { resolve } = require('path');
const dotenv = require('dotenv');

dotenv.config();

const targetPath = resolve(__dirname, './src/environments/environment.ts');

const envConfigFile = `
export const environment = {
  production: false,
  SERVER_URL_SECURITY_AUTH: '${process.env["SERVER_URL_SECURITY_AUTH"]}',
  SERVER_URL_API_TOKENIZER: '${process.env["SERVER_URL_API_TOKENIZER"]}',
  SERVER_URL_BITACORA: '${process.env["SERVER_URL_BITACORA"]}',
  BITACORA_identificador: '${process.env["BITACORA_identificador"]}',
  BITACORA_aplicativoId: '${process.env["BITACORA_aplicativoId"]}',
  BITACORA_consumerId: '${process.env["BITACORA_consumerId"]}',
  BITACORA_capa: '${process.env["BITACORA_capa"]}'
};
`;

writeFileSync(targetPath, envConfigFile);
console.log(`Output generated at ${targetPath}`);

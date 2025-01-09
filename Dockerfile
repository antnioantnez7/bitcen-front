
# Usar una imagen base de Node.js para la construcción
FROM node:18-alpine AS build

# Install gettext to have envsubst available
RUN apk update && apk add gettext

# Establece el directorio de trabajo
WORKDIR /app

RUN npm config set registry http://registry.npmjs.org

# Copiamos los archivos de los paquetes al contenedor
# COPY package*.json ./
COPY package.json package-lock.json ./

# Corremos ci para el ambiente de procuccion
RUN npm ci

# Copiamos el resto de los archivos
COPY . .

USER root

RUN chmod +x ./src/app/scripts/reemplazar-vars.sh

COPY ./src /app/src
COPY ./src/app/scripts/reemplazar-vars.sh ./src/app/scripts/reemplazar-vars.sh

RUN chmod +x ./src/app/scripts/reemplazar-vars.sh

RUN ./src/app/scripts/reemplazar-vars.sh
RUN npm run build --prod

#FROM nginx:alpine
FROM nginxinc/nginx-unprivileged 

# Copia los archivos construidos en la etapa anterior al contenedor de Nginx
COPY --from=build /app/dist/bitacora-banobras/browser /usr/share/nginx/html

EXPOSE 80

# Comando para iniciar Nginx
CMD ["nginx", "-g", "daemon off;"]

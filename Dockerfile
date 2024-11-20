FROM node:18-alpine AS build

WORKDIR /app

# Ejecuta el script para reemplazar las variables de entorno en environment.ts
RUN node set-environment.js


RUN npm config set registry http://registry.npmjs.org


# Copiamos los archivos de los paquetes al contenedor
# COPY package*.json ./
COPY package.json package-lock.json ./


# Corremos ci para el ambiente de procuccion
RUN npm ci


# Copiamos el resto de los archivos
COPY . .
RUN npm run build

FROM nginx:alpine

# Copia los archivos construidos en la etapa anterior al contenedor de Nginx
COPY --from=build /app/dist/bitacora-banobras/browser /usr/share/nginx/html

# Copia la configuración de Nginx
COPY --from=build /app/nginx.conf /etc/nginx/nginx.conf

EXPOSE 80

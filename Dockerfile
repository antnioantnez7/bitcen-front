FROM node:18-alpine AS build

WORKDIR /app

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

COPY ./src/assets/env.template.js /usr/share/nginx/html/assets/env.template.js
RUN chmod +x /usr/share/nginx/html/assets/
RUN chmod -R 755 /usr/share/nginx/html/assets/

CMD ["/bin/sh", "-c", "envsubst < /usr/share/nginx/html/assets/env.template.js > /usr/share/nginx/html/assets/env.js && exec nginx -g 'daemon off;'"]

# Copia la configuración de Nginx
COPY --from=build /app/nginx.conf /etc/nginx/nginx.conf

EXPOSE 80

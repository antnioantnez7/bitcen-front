echo "Ejecutando reemplazo de variables000"
#! /bin/bash
echo "Ejecutando reemplazo de variables111"

which envsubst
# Reemplazar las variables de entorno en el archivo de configuración
envsubst < src/enviroments/environment.prod.template.ts > src/enviroments/environment.prod.ts

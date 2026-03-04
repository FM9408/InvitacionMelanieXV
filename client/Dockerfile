# Usamos Node 20-slim para mantener la imagen pequeña
FROM node:20-slim

WORKDIR /app

# Copiamos los archivos de dependencias
COPY package*.json ./

# Instalamos dependencias
RUN npm install

# Copiamos el resto del código
COPY . .

# Vite usa por defecto el puerto 5173
EXPOSE 5173

# Comando para desarrollo con soporte para red externa
CMD ["npm", "run", "dev", "--", "--host"]
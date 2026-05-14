# Usa la imagen completa de node para asegurar que tenga los certificados de red
FROM node:20

# Crear directorio de trabajo
WORKDIR /app

# Copiar archivos de dependencias
COPY package*.json ./

# Instalar dependencias
RUN npm install

# Copiar el resto del código
COPY . .

# Cloud Run usa el 8080. Si tu código usa API_PORT, asegúrate que lea process.env.PORT
ENV API_PORT=8080
ENV NODE_ENV=production
EXPOSE 8080
EXPOSE 4000

CMD ["node", "index.js"]
# ETAPA 1: Construcción
FROM node:20-slim AS builder
WORKDIR /app

# Copiamos archivos de dependencias
COPY package*.json ./

# Instalamos TODAS las dependencias (necesarias para el build)
RUN npm install

# Copiamos el resto del código
COPY . .

# SI TIENES UN FRONTEND QUE COMPILAR, DESCOMENTA LA SIGUIENTE LÍNEA:
# RUN npm run build --prefix client

# ETAPA 2: Producción (Esta es la que realmente se sube a Cloud Run)
FROM node:20-slim
WORKDIR /app

# Definimos el entorno
ENV NODE_ENV=production

# Copiamos las dependencias instaladas y el código desde la etapa anterior
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app ./

# Cloud Run usa el puerto 8080 por defecto
EXPOSE 8080

# Al estar index.js en la raíz, este comando es correcto
CMD ["node", "index.js"]
FROM node:20-slim AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
FROM node:20-slim
WORKDIR /app
ENV NODE_ENV=development
COPY --from=builder /app/node_modules ./node_modules
COPY package*.json ./
COPY . .
EXPOSE 8080
CMD ["node", "index.js"]
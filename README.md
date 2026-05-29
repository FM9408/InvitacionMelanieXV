# 💌 Plataforma Digital de Invitaciones Integradas — XV de Melanie

![Firebase Hosting](https://img.shields.io/badge/Frontend-Firebase%20Hosting-orange?logo=firebase&logoColor=white)
![Google Cloud Run](https://img.shields.io/badge/Backend-Cloud%20Run-blue?logo=googlecloud&logoColor=white)
![Supabase](https://img.shields.io/badge/Database-Supabase%20%26%20PostgreSQL-green?logo=supabase&logoColor=white)

Estructura de arquitectura robusta basada en un enfoque de **Monorepo** para la gestión y ejecución de la aplicación de invitaciones digitales de los XV Años de Melanie. La plataforma integra un cliente interactivo moderno (Single Page Application), una API REST escalable con persistencia de datos en la nube y un módulo conmemorativo dedicado (*In Memoriam*).

---

## 🏗️ Arquitectura General del Sistema

El proyecto está diseñado bajo una arquitectura desacoplada para garantizar rendimiento óptimo, aislamiento de entornos y máxima seguridad en el manejo de datos críticos:

```
┌─────────────────────────┐
│    Cliente (React)      │
│  Desplegado en Firebase │
└────────────┬────────────┘
             │
             │ HTTPS / JSON
             ▼
┌─────────────────────────┐
│    API REST (Node.js)   │
│   Contenedor Cloud Run  │
└────────────┬────────────┘
             │
             │ PostgreSQL Protocol
             ▼
┌─────────────────────────┐
│  Base Datos (Supabase)  │
│   Instancia Relacional  │
└─────────────────────────┘
```

## 📂 Estructura del Monorepo

```
xvdemelanie-monorepo/
├── api/
│   ├── src/                                   # Lógica central del Backend (Express)
│   ├── Dockerfile                             # Configuración de contenedorización de la API
│   └── package.json
├── client/
│   ├── src/                                   # Componentes, vistas y lógica (React + Vite)
│   ├── index.html
│   └── package.json
├── firebase.json                              # Configuración de entornos de Firebase Hosting
└── README.md                                  # Documentación técnica del sistema
```

---

## 🛠️ Stack Tecnológico

* **Frontend:** React (Vite), Material-UI (MUI), Redux (Gestión de estado global de confirmaciones y mapa de asientos).
* **Backend:** Node.js, Express, Sequelize ORM.
* **Base de Datos:** PostgreSQL alojado en la infraestructura de Supabase.
* **Infraestructura de Despliegue:**
  * *Cliente:* Firebase Hosting (Hosting estático de alta disponibilidad).
  * *API Backend:* Google Cloud Run (Estructura Serverless basada en contenedores Docker).

---

### ⚙️ Configuración de Variables de Entorno

Para levantar el proyecto e intercomunicar los módulos de forma correcta, es necesario estructurar los archivos de configuración en cada directorio:

#### 1. Variables del Backend (`api/.env`)

Establece los parámetros de conexión para el entorno de ejecución de Node.js y la instancia de la base de datos relacional:

```env
NODE_ENV=development
API_PORT=8080
DB_USER=postgres
DB_PASSWORD=tu_password_de_supabase
DB_NAME=postgres
DB_HOST=tu_base_de_datos_de_supabase
```

#### 2. Variables del Cliente (`client/.env`)

```env
VITE_API_PORT=8080
VITE_API_URL=[https://tu-servicio-api-en-cloud-run.run.app](https://tu-servicio-api-en-cloud-run.run.app)

VITE_FIREBASE_APIKEY=tu_firebase_api_key_aqui
VITE_FIREBASE_AUTHDOMAIN=tu_proyecto.firebaseapp.com
VITE_FIREBASE_PROJECTID=tu_project_id_firebase
VITE_FIREBASE_STORAGEBUCKET=tu_proyecto.firebasestorage.app
VITE_FIREBASE_MESSAGINSENDERID=tu_sender_id
VITE_FIREBASE_APPID=tu_app_id_config
```

---

## 💎 Características Principales Implementadas

* **Seating Chart:** Mapeo interactivo y dinámico de las mesas del evento con persistencia en PostgreSQL para controlar en tiempo real las confirmaciones de asistencia y la distribución de lugares sin duplicidades.

* **In Memoriam Section:** Componente conmemorativo con renderizado fluido, diseñado con un profundo respeto estético y cuidado visual para recordar a los familiares ausentes en la celebración.

* **Estructura Modular:** Aislamiento completo entre la lógica del cliente y el servidor, permitiendo realizar mantenimiento o modificaciones de base de datos sin afectar la disponibilidad del frontend.
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const MainRouter = require('./routes/index.js');

// No es necesario llamar a require('./db.js') aquí si ya lo haces en index.js
// Pero mantenemos la coherencia si tienes lógica de inicialización ahí.

const api = express();

// --- 1. CONFIGURACIÓN DE MIDDLEWARES ---

// Morgan solo en desarrollo para no saturar los logs de Cloud Run
if (process.env.NODE_ENV === 'development') {
    api.use(morgan('dev'));
}

// Configuración de CORS optimizada
// Al definir el origen de forma explícita y limitar los métodos,
// el navegador procesa las peticiones mucho más rápido.
api.use(
    cors({
        origin: process.env.CLIENT_URL,
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
        credentials: true,
        allowedHeaders: [
            'Content-Type',
            'Authorization',
            'Accept',
            'Origin',
            'X-Requested-With',
        ],
    })
);

// Parsing de JSON y Body con límites controlados para evitar ataques DoS
api.use(express.json({ limit: '10mb' })); // Reducido de 50mb a 10mb (más que suficiente para texto)
api.use(bodyParser.urlencoded({ extended: true, limit: '10mb' }));
api.use(cookieParser());

// --- 2. RUTAS ---

// Prefijo de API para mantener orden
api.use('/api', MainRouter);

// Ruta de salud (Health Check) - Vital para Cloud Run
api.get('/health', (req, res) => {
    res.status(200).send('OK');
});

// --- 3. MANEJO DE ERRORES CENTRALIZADO ---

api.use((err, req, res, next) => {
    const status = err.status || 500;
    const message = err.message || 'Internal Server Error';

    // Solo logueamos errores críticos en producción
    if (status === 500) {
        console.error(`[ERROR] ${req.method} ${req.url}:`, err.stack);
    }

    res.status(status).json({
        error: true,
        message: message,
        // No enviamos el stack del error en producción por seguridad
        stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
    });
});

module.exports = api;

const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const compression = require('compression'); // 1. Nueva dependencia
const MainRouter = require('./routes/index.js');

const api = express();

// --- 1. MIDDLEWARES DE RENDIMIENTO ---

// Health Check ANTES de cualquier lógica para respuesta ultra-rápida
api.get('/health', (req, res) => {
    res.status(200).send('OK');
});

// Comprime todas las respuestas HTTP
api.use(compression());

if (process.env.NODE_ENV === 'development') {
    api.use(morgan('dev'));
}

// Configuración de CORS
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

// 2. Usar parsers nativos de Express (eliminamos body-parser)
api.use(express.json({ limit: '5mb' })); // Bajamos a 5mb (sigue siendo mucho para texto)
api.use(express.urlencoded({ extended: true, limit: '5mb' }));
api.use(cookieParser());

// --- 2. RUTAS ---

api.use('/api', MainRouter);

// --- 3. MANEJO DE ERRORES ---

api.use((err, req, res, next) => {
    const status = err.status || 500;
    const message = err.message || 'Internal Server Error';

    if (status === 500) {
        console.error(`[ERROR] ${req.method} ${req.url}:`, err.stack);
    }

    res.status(status).json({
        error: true,
        message: message,
        stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
    });
});

module.exports = api;

const http = require('node:http');
const { Server } = require('socket.io');
const api = require('../app');

// Crear el servidor HTTP envolviendo la app de Express
const server = http.createServer(api);

const io = new Server(server, {
    cors: {
        // Asegúrate de que CLIENT_URL no tenga una barra diagonal al final
        origin: '*',
        methods: ['GET', 'POST'],
        credentials: true,
    },
    // Configuración crucial para Cloud Run y estabilidad
    pingTimeout: 60000, // Tiempo de espera para detectar desconexiones
    pingInterval: 25000,
    transports: ['websocket', 'polling'], // Permitir fallback si el websocket falla
    allowEIO3: true, // Compatibilidad con versiones anteriores si es necesario
});

io.on('connection', (socket) => {
    console.log(`Cliente conectado: ${socket.id}`);
    socket.emit('newConnection', socket.id)
    // Manejo de errores interno del socket
    socket.on('error', (err) => {
        console.error(`Error en socket ${socket.id}:`, err);
    });

    socket.on('disconnect', (reason) => {
        console.log(`Cliente desconectado (${socket.id}): ${reason}`);
        // IMPORTANTE: NO llamar a socket.disconnect() aquí.
        // El socket ya está en proceso de desconexión.
    });
});

module.exports = { server, io };

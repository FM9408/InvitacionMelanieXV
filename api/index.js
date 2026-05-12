require('dotenv').config({
    path: './.env',
    override: true,
});
require('./src/db.js')
const { NODE_ENV, API_PORT } = process.env;
const mock = require('./src/mock.js')
const { server, io } = require('./src/config/websocketConfig');
const connectionEmitter = require('./src/config/emmiter');
const { conn } = require('./src/db.js');
const api = require('./src/app.js');

// --- Configuración de Eventos de Socket.io ---
// Centralizamos los eventos para mantener el flujo de datos limpio
const setupSocketEvents = () => {
    connectionEmitter.on('familyCreated', (data) => {
        io.emit('newFamilyCreated', data);
    });

    connectionEmitter.on('mensajeCreado', (data) => {
        io.emit('newMensajeCreado', data);
    });

    connectionEmitter.on('confirmationUpdated', (data) => {
        io.emit('newConfirmation', data);
    });
    connectionEmitter.on('mensajeEliminado', (data) => {
        io.emit('newMensajeEliminado', data);
    });
    connectionEmitter.on('mesaAsignada', (data) => {
        io.emit('newMesaAsignada', data);
    });
    connectionEmitter.on("invitationUpdated", (data) => {
        io.emit('newConfirmation', data);
    })
};

// --- Función de Inicio del Servidor ---
const startServer = async () => {
    try {
        // 1. Autenticar y sincronizar Base de Datos primero
        console.log('🔄 Conectando a la base de datos...');
        await conn.authenticate();

        // Solo aplicar force/alter en desarrollo local
        const isDev = NODE_ENV === 'development';
        await conn.sync({
            force: isDev,
            alter: isDev,
            logging: false,
        });
        console.log('✅ Base de datos sincronizada');

        // 2. Configurar eventos de socket
         setupSocketEvents();

        // 3. Iniciar escucha del servidor
        // Cloud Run requiere escuchar en 0.0.0.0
        const port = API_PORT || 8080;
        server.listen(port, '0.0.0.0', () => {
            console.log(
                `🚀 Servidor listo en puerto ${port} (Modo: ${NODE_ENV})`
            );
        });
         NODE_ENV === 'development' && mock.seedDatabase()  ; // Solo cargar datos de prueba en desarrollo
    } catch (error) {
        console.error('❌ Error crítico durante el arranque:', error);
        process.exit(1); // Salida con error si no hay DB
    }
};
// --- Manejo de Cierre (Graceful Shutdown) ---
// Vital para entornos Cloud para no dejar procesos colgados
const gracefulShutdown = () => {
    console.log('⚠️ Iniciando cierre del servidor...');
    server.close(async () => {
        console.log('HTTP server cerrado.');
        try {
            await conn.close();
            console.log('Conexión a DB cerrada.');
            process.exit(0);
        } catch (err) {
            console.error('Error al cerrar DB:', err);
            process.exit(1);
        }
    });
};

process.on('SIGTERM', gracefulShutdown);
process.on('SIGINT', gracefulShutdown);

// Lanzar servidor
startServer();

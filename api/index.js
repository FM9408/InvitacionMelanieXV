require('dotenv').config({
    path: './.env',
    override: true,
});
require('./src/db.js');
const { NODE_ENV, API_PORT } = process.env;
const mock = require('./src/mock.js');
const { server, io } = require('./src/app.js');
const connectionEmitter = require('./src/config/emmiter');
const { conn } = require('./src/db.js')

//--- Configuración de Eventos de Socket.io ---
const setupSocketEvents = () => {
    
  
   
    const events = {
       
       
       
        nuevaNotificacion: 'newNotification',
    };

    Object.entries(events).forEach(([emitterEvent, socketEvent]) => {
        connectionEmitter.on(emitterEvent, (data) => 
            io.emit(socketEvent, data)
        );
    });
};

const startServer = async () => {
    try {
        console.log('🔄 Conectando a la base de datos...');
        await conn.authenticate();

        const isDev = NODE_ENV === 'development';
        console.log(isDev)
        // OPTIMIZACIÓN: Solo sincronizar si es estrictamente necesario
        // En producción (Cloud Run), esto debería ser false para evitar lentitud
        await conn.sync({
            force: isDev,
            alter: true, // Cambiar a true solo cuando modifiques modelos
            logging: false
        });
        console.log('✅ Base de datos sincronizada');

         setupSocketEvents();

        // Seed de datos ANTES de levantar el listener para evitar estados inconsistentes
        if (isDev) {
            await mock.seedDatabase();
            console.log('🌱 Datos de prueba cargados');
        }

        const port = API_PORT || 8080
        server.listen(port, '0.0.0.0', () => {
            console.log(
                `🚀 Servidor listo en puerto ${port} (Modo: ${NODE_ENV})`
            );
        });
    } catch (error) {
        console.error('❌ Error crítico durante el arranque:', error);
        process.exit(1);
    }
};

// Graceful Shutdown permanece igual...
const gracefulShutdown = () => {
    server.close(async () => {
        try {
            await conn.close();
            process.exit(0);
        } catch (err) {
            process.exit(1);
        }
    });
};

process.on('SIGTERM', gracefulShutdown);
process.on('SIGINT', gracefulShutdown);

startServer();

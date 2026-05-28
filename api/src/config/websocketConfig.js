const { Server } = require('socket.io');
const connectionEmitter = require('../config/emmiter');
let io;
module.exports = {
    initSocket: (httpServer) => {
        const { Server } = require('socket.io');
        io = new Server(httpServer, { cors: {
                 // Asegúrate de que CLIENT_URL no tenga una barra diagonal al final
                 origin: '*',
                 methods: ['GET', 'POST'],
                 credentials: true,
             },
             // Configuración crucial para Cloud Run y estabilidad
             pingTimeout: 60000, // Tiempo de espera para detectar desconexiones
             pingInterval: 25000,
             connectionStateRecovery: {
                 maxDisconnectionDuration: 120000,
                 skipMiddlewares: true,
             },
             connectTimeout: 10000,
             transports: ['websocket', 'polling'], // Permitir fallback si el websocket falla
             allowEIO3: true, // Compatibilidad con versiones anteriores si es necesario
        }); 
        io.on('connection', (socket) => {
            socket.join(`${socket.id}`)
            socket.emit('newConnection', socket.id);
            socket.on('unirse_familia', (familyID) => {
                socket.join(`/${familyID}`);
                socket.join('/invitados');
                
                console.log(
                    `Cliente ${socket.id} se unió a la familia ${familyID}`
                );
            });
            socket.on('newAdminlogged', (socketId) => {
                socket.join('/Admins');
                socket.rooms.forEach((room) => {
                    if (room !== socket.id) {
                        console.log(room)
                    }
                });
                console.log(`Admin logeado ${socketId}`);
            });

            socket.on('adminLoggedOut', (socketId) => {
                socket.leave('/Admins');
                console.log(`Admin desconectado ${socketId}`);
            });
            //Manejo de errores interno del socket
            socket.on('error', (err) => {
                console.error(`Error en socket ${socket.id}:`, err);
            });

            socket.on('disconnect', (reason) => {
                console.log(`Cliente desconectado (${socket.id}): ${reason}`);
                // IMPORTANTE: NO llamar a socket.disconnect() aquí.
                // El socket ya está en proceso de desconexión.
                socket.disconnect();
            });
        });
        return io;
    },
    getIO: () => io,
};
// Crear el servidor HTTP envolviendo la app de Express





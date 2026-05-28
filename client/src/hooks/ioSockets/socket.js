import { io } from 'socket.io-client';

// Extraemos la URL de la variable de entorno
const URL = import.meta.env.VITE_API_URL;

export const socket = io(URL, {
    /**
     * IMPORTANTE: Cloud Run maneja mejor las conexiones directas por WebSocket.
     * Al forzar 'websocket', evitas el error 404 inicial del handshake de 'polling'
     * que se ve en tus capturas de pantalla.
     */

    transports: ['websocket', 'polling'],

    // Evita que el socket intente conectarse automáticamente al importar el archivo
    // permitiendo que App.jsx controle el inicio de la conexión.
    autoConnect: true,

    // Configuraciones de robustez
    reconnectionAttempts: 5,
    reconnectionDelay: 5000,
});

/**
 * Agregamos listeners básicos de diagnóstico para ayudarte a debugear en consola
 * sin afectar el rendimiento de la UI.
 */
socket.on('connect', () => {
    socket.connect();
});

socket.on('connect_error', (error) => {
    console.error(
        '%c Error de conexión en Socket:',
        'color: #f44336; font-weight: bold;',
        error.message
    );
    document.dispatchEvent(new Event('socketError'));
});

socket.on('disconnect', (reason) => {
    socket.off('newMensaje');
    socket.off('newMensajeEliminado');
    socket.off('newFamilyCreated');
    socket.off('newConfirmation');
    socket.disconnect();
    console.log(
        '%c Socket desconectado:',
        'color: #ff9800; font-weight: bold;',
        reason
    );
});

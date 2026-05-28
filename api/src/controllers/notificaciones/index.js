const { Notificacion } = require('../../db');

const connectionEmitter = require('../../config/emmiter');

connectionEmitter.on('crearNotificacion', async (data) => {
    try {
         const notificacion = await Notificacion.create({
             mensaje: data.mensaje,
         });
        connectionEmitter.emit('nuevaNotificacion', notificacion)
    } catch (error) {
        console.error(error);
    }
});

async function getNotifications(req, res) {
    try {
        const notificaciones = await Notificacion.findAll({});

        res.status(200).json(notificaciones);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }

}

module.exports = {
    getNotifications,
};

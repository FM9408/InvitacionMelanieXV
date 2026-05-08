require('dotenv').config({
    path: './.env',
    override: true,
})
const { NODE_ENV, API_PORT } = process.env
const server = require('./src/config/websocketConfig').server
const io = require('./src/config/websocketConfig').io
const connectionEmitter = require('./src/config/emmiter')
const api = require('./src/app')
const { conn } = require('./src/db.js')
const mock = require('./src/mock')





server.listen(4000)
connectionEmitter.on('familyCreated', (data) => {
    io.emit('newFamilyCreated', data)
})
connectionEmitter.on('mensajeCreado', (data) => {
    io.emit('newMensajeCreado', data)
})

api.listen(API_PORT, '0.0.0.0', async () => {
    console.log(process)
    console.log(`Server listening on port ${API_PORT}`)
    try {
        await conn.authenticate();
        await conn.sync({
            force: NODE_ENV === 'development',
            alter: NODE_ENV === 'development',
            logging: false,
        });
        await mock.seedDatabase();
    } catch (error) {
        console.error('Error al conectar a la base de datos:', error);
    }
});


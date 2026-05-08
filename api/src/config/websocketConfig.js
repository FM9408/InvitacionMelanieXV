const http = require('node:http')
const {Server} = require('socket.io')
const api = require('../app');



const server = http.createServer(api);
const io = new Server(server, {
    cors: {
        origin: '*'
    }
});

io.on('connection', (socket) => {
    
    socket.on('disconnect', () => {
       
        socket.disconnect()
    })

})


module.exports = {server, io}
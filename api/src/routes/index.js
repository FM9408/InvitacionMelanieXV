const { Router } = require('express')
const invitadosRouter = require('./invitados')
const mensajeRouter = require("./mensajes")
const notificationRouter = require("./notifications")


const MainRouter = Router()
MainRouter.use('/invitados', invitadosRouter)
MainRouter.use("/mensajes", mensajeRouter)
MainRouter.use("/notificaciones", notificationRouter)






module.exports = MainRouter

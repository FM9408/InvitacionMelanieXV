const { Router } = require('express')
const invitadosRouter = require('./invitados')
const mensajeRouter = require("./mensajes")

const MainRouter = Router()
MainRouter.use('/invitados', invitadosRouter)
MainRouter.use("/mensajes", mensajeRouter)



module.exports = MainRouter

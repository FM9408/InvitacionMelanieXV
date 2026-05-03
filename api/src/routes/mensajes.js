const { Router} = require("express")
const { createNewMensaje, getAll} = require("../controllers/mensajes/index.js")
const mensajesRouter = Router()

mensajesRouter.post("/sendMensaje/:familiaID", createNewMensaje)
mensajesRouter.get("/getAll", getAll )


module.exports = mensajesRouter
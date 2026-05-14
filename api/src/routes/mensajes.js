const { Router} = require("express")
const { createNewMensaje, getAll , deleteMensaje} = require("../controllers/mensajes/index.js")



const mensajesRouter = Router()

mensajesRouter.post("/sendMensaje/:familiaID", createNewMensaje)
mensajesRouter.get("/getAll", getAll )
mensajesRouter.delete("/deleteMensaje/:id", deleteMensaje)



module.exports = mensajesRouter
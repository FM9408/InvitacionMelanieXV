const { Router } = require('express')
const {
    getAllFamiles,
    registrarFamilia,
    borrarFamilia,
    buscarPorCualquierMiembro,
    buscarFamilia,
    setConfirmation,
    setInvitationViewed,
    asignacionDeMesas,
    modificarFamilia
} = require('../controllers/invitados/index.js')

const invitadosRouter = Router()

invitadosRouter.get('/getFamiles', getAllFamiles)
invitadosRouter.post('/addFamilia', registrarFamilia)
invitadosRouter.get('/buscarFamilia', buscarFamilia)
invitadosRouter.delete('/borrarFamilia/:id', borrarFamilia)
invitadosRouter.get("/buscarMiembros", buscarPorCualquierMiembro)
invitadosRouter.put("/setConfirmation", setConfirmation)
invitadosRouter.put("/setInvitationViewed/", setInvitationViewed)
invitadosRouter.put("/asignarMesa", asignacionDeMesas)
invitadosRouter.put("/modificarFamilia", modificarFamilia)



module.exports = invitadosRouter

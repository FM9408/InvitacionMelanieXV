const { Mensaje, Familia, conn } = require("../../db")
const connectionEmitter = require('../../config/emmiter.js')



async function createNewMensaje(req, res) { 
    const { mensaje } = req.body
    const { familiaID } = req.params
    const t = await conn.transaction()
    
    
    try {
        const getFamily = await Familia.findOne(
            {
                where: {
                    id: familiaID
                },
                include: {
                    all: true,
                    nested: true
                },
                
            }
        )  
       

        if (!getFamily) {
            return res.status(404).json({ error: "familia no encontrada" })
            
        }
        const newMessage = await Mensaje.create(
            {
                mensaje,
                apellido: getFamily.apellido,
                familia_Id: familiaID,
                enviado: Date.now()
            },
            { transaction: t, include: { all: true, nested: true } }
        );
        
       
        
        await t.commit()
        await getFamily.addMensaje(newMessage)
        
        req.io.to('/Admins').emit('newMensajeCreado', newMessage);
        connectionEmitter.emit('crearNotificacion', {
            mensaje: `La familia ${getFamily.apellido} ha enviado un mensaje`,
        });
  
        res.status(201).json({
            mensaje: 'Mensaje creado correctamente'
        })
    } catch (error) {
         await t.rollback()
         res.status(500).json({ error: error.message })
    }
}

async function getAll(req, res) {
    try {
        const allMensajes = await Mensaje.findAll({
            include: {
                all: true,
                nested: true
            }
        })

        res.status(200).send(allMensajes)
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}


async function deleteMensaje(req, res) {
    const { id } = req.params
    const t = await conn.transaction()
    try {
        const mensaje = await Mensaje.findOne({
            where: {
                id
            },
            include: {
                all: true,
                nested: true
            }
        });
        if (!mensaje) {
            return res.status(404).json({ error: "mensaje no encontrado" });
        }
       
        await t.commit();
        const familia = await Familia.findOne({
            where: {
                id: mensaje.familia_Id
            },
            include: {
                all: true,
                nested: true
            }
        });
        req.io.to("/Admins").emit('newMensajeEliminado', mensaje)
        await familia.removeMensaje(mensaje);
        await mensaje.destroy();
        res.status(200).json({
            mensaje: 'Mensaje eliminado correctamente'
        });
        
    } catch (error) {
        await t.rollback();
        res.status(500).json({ error: error.message });
    }
}



module.exports = {createNewMensaje,getAll,deleteMensaje}
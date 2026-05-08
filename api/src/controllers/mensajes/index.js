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
                familia_Id: familiaID,
            },
            { transaction: t }
        );
        
       
        
        await t.commit()
        await getFamily.addMensaje(newMessage)
        connectionEmitter.emit('mensajeCreado', newMessage);
  
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

module.exports = {createNewMensaje,getAll}
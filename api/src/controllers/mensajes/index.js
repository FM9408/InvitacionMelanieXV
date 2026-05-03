const { Mensaje, Familia, conn } = require("../../db")



async function createNewMensaje(req, res) {
    const { mensaje } = req.body
    const {familiaID} = req.params
    const t = await conn.transaction()
    const now = new Date(Date.now()).toISOString()
  
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
        
        const newMensaje = await Mensaje.create({
                enviado: now,
                mensaje,
                familia_Id: familiaID
            
        }, {
            transaction: t
        })
        await getFamily.addMensaje(newMensaje)
        await t.commit()
        
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

        res.status(300).send(allMensajes)
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}

module.exports = {createNewMensaje,getAll}
const { Invitado, Familia, conn } = require('../../db')
const connectionEmitter = require('../../config/emmiter')
const { Op } = require('sequelize')


const getAllFamiles = async function (req, res) {
    try {
        const familias = await Familia.findAll({
            attributes: ['id', 'apellido', 'pases', 'hasViewed'], // Solo columnas necesarias
            include: {
                model: Invitado,
                as: 'miembros', // Asegúrate que el alias coincida con tu modelo
                attributes: ['id', 'nombre', 'willAssist', 'mesa'],
            },
        });
        res.status(200).json(familias);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const registrarFamilia = async (req, res) => {
    const t = await conn.transaction()

    try {
        const { apellido, invitados } = req.body

        // 1. Crear la Familia
        const familia = await Familia.create(
            {
                apellido,
                pases: invitados.length
            },
            
            { transaction: t, include: {all: true, nested: true} }
        )
        await t.commit()
        
        // 2. Preparar los invitados con el ID de la familia recién creada
        if (invitados.length >= 1) {
            invitados.forEach(async (invitado) => {
                const p = await conn.transaction()
                const mienbro = await Invitado.create(
                    {
                        ...invitado,
                        apellido: familia.apellido,
                        familia_Id: familia.id
                    }, {
                        transaction: p,
                        include: {all: true, nested: true}
                    }
                    
                )
                
                await familia.addMiembro(mienbro)
                await p.commit()
            })
        }
        connectionEmitter.emit('familyCreated', familia)
        
        res.status(201).json({
            message: 'Familia e invitados creados',
            familia
        })
    } catch (error) {
        await t.rollback()
        res.status(500).json({ error: error.message })
    }
}

const buscarPorCualquierMiembro = async (req, res) => {
    const { nombre } = req.query
    try {
        const resultados = await Invitado.findAll({
            where: {
                [Op.or]: [
                    { nombre: { [Op.like]: `%${nombre}%` } },
                    { apellido: { [Op.like]: `%${nombre}%` } }
                ]
            },
            include: {
                all: true,
                nested: true
            }
        })
        
        res.status(200).json(resultados)
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}

async function buscarFamilia(req, res) {
    const { nombre } = req.query
    try {
        const familia = await buscarPorCualquierMiembro(nombre)
        res.status(200).json(familia)
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}


async function borrarFamilia(req, res) {
    const { id } = req.params
    try {
        const familia = await Familia.findByPk(id)
        if (!familia) {
            return res.status(404).json({ error: 'Familia no encontrada' })
        }
        const miembros = await familia.getMiembros()
        for (const miembro of miembros) {
            await miembro.destroy()
        }
        await familia.destroy()
        res.status(200).json({ message: 'Familia borrada' })

    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}

async function setConfirmation(req, res) {
    const { invitados } = req.body;
    try {
        // Actualización masiva en una sola consulta
        await Invitado.update(
            {
                willAssist: 'Confirmado',
                confirmationdate: new Date(),
            },
            {
                where: { id: invitados.willAssist },
            }
        );

        await Invitado.update(
            {
                willAssist: 'Rechazada',
            },
            {
                where: { id: invitados.wontAssist },
            }
        );

        connectionEmitter.emit('invitationsUpdated', {
            status: 'bulk_updated',
        });
        res.status(200).json({ message: 'Invitados actualizados' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

async function setInvitationViewed (req, res) {
    const { familiaId } = req.query
    try { 
        await Familia.update({
            hasViewed: true
        }, {
            where: {
                id: familiaId
            }
        })     
        
        
        res.status(200).json({
            message: 'Familia actualizada'
        })
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}


async function asignacionDeMesas(req, res) {
    const { familias } = req.body;
    const t = await conn.transaction(); // Una sola para todo
    try {
        for (const familia of familias) {
            for (const miembro of familia.miembros) {
                await Invitado.update(
                    { mesa: miembro.mesa },
                    { where: { id: miembro.id }, transaction: t }
                );
            }
        }
        await t.commit();
        // ... resto del código
    } catch (error) {
        await t.rollback();
        res.status(500).json({ error: error.message });
    }
}

async function modificarFamilia (req, res) {
    const {id, invitados} = req.body
    try {
        const familia = await Familia.findByPk(id);
        for (const miembro of invitados) {
            const findInvitado = await Invitado.findByPk(miembro.id)
            if (findInvitado) {
                await familia.removeMiembro(findInvitado)
                await findInvitado.destroy()
            } 
            await Invitado.create(
                {
                    ...miembro,
                    apellido: familia.apellido,
                    familia_Id: familia.id
                },
                {
                    include: {all: true, nested: true}
                }
            )
           
        }
        res.status(200).json({ message: 'Familia actualizada' })
    }catch (error) {
        res.status(500).json({ error: error.message })
        console.log(error)
    }


}


module.exports = { getAllFamiles, registrarFamilia, buscarFamilia, borrarFamilia, buscarPorCualquierMiembro, setConfirmation, setInvitationViewed,asignacionDeMesas, modificarFamilia }

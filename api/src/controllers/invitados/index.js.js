const { Invitado, Familia, conn } = require('../../db')
const connectionEmitter = require('../../config/emmiter')
const { Op, where } = require('sequelize')


const getAllFamiles = async function (req, res) {
    try {
        const familias = await Familia.findAll({
            attributes: ['id', 'apellido', 'pases', 'hasViewed'], // Solo columnas necesarias
            include: {
                model: Invitado,
                as: 'miembros', // Asegúrate que el alias coincida con tu modelo
                attributes: [
                    'id',
                    'nombre',
                    'apellido',
                    'willAssist',
                    'mesa',
                    'confirmationDate',
                    'nombreCompleto'
                ],
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
    const { invitados } = req.body
    try {
        // 1. Procesar los que SÍ asisten
        if (invitados && invitados.willAssist) {
            await Invitado.update(
                {
                    willAssist: 'Confirmado',
                    confirmationDate: Date.now(), // <-- En formato de texto ISO
                },
                { where: { id: invitados.willAssist } }
            );
        }

        // 2. Procesar los que NO asisten
        if (invitados && invitados.wontAssist) {
            await Invitado.update(
                {
                    willAssist: 'Rechazada',
                    confirmationDate: null
                    // <-- En formato de texto ISO
                },
                { where: { id: invitados.wontAssist } }
            );
        }

        connectionEmitter.emit('invitationsUpdated', {
            status: 'bulk_updated',
        });

        return res
            .status(200)
            .json({ message: 'Invitaciones actualizadas con éxito' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: error.message });
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

        connectionEmitter.emit("mesasAsignadas", familias)
        res.status(200).json({ message: "familia actualizada" })
    } catch (error) {
        await t.rollback();
        res.status(500).json({ error: error.message });
    }
}

const modificarFamilia = async (req, res) => {
    try {
        const { id, nombreFamilia, invitados } = req.body;

        // 1. Buscamos la instancia de la familia
        const familia = await Familia.findByPk(id);
        if (!familia) {
            return res.status(404).json({ error: 'Familia no encontrada' });
        }

        // 2. Extraemos los IDs de los miembros que SÍ se quedan (los que envió el frontend)
        const idsQueSeQuedan = invitados
            .map((m) => m.id)
            .filter((id) => id !== undefined && id !== null);

        // 3. ¡ELIMINACIÓN DE LOS MIEMBROS REMOVIDOS!
        // Usamos Op.notIn para destruir los registros de los invitados que ya no pertenecen
        const tDelete = await conn.transaction();
        try {
            await Invitado.destroy({
                where: {
                    familia_Id: id, // Asegura que sean de esta familia
                    id: {
                        [Op.notIn]: idsQueSeQuedan, // Si su ID no vino en el array, se elimina físicamente
                    },
                },
                transaction: tDelete,
            });
            await tDelete.commit();
        } catch (err) {
            await tDelete.rollback();
            throw err;
        }

        // 4. Tu bucle original modificado para procesar los que sí se quedaron o los nuevos
        for (const miembro of invitados) {
            if (!miembro.id) {
                const p = await conn.transaction();
                try {
                    const newInvitado = await Invitado.create(
                        {
                            nombre: miembro.nombre,
                            mesa: 0,
                            apellido: nombreFamilia,
                            willAssist: 'Pendiente',
                        },
                        { transaction: p }
                    );

                    await p.commit();
                    // Vinculamos el nuevo miembro usando el método mágico de la instancia
                    await familia.addMiembro(newInvitado);
                } catch (err) {
                    await p.rollback();
                    throw err;
                }
            } else {
                const p = await conn.transaction();
                try {
                    await Invitado.update(
                        {
                            nombre: miembro.nombre,
                            mesa: miembro.mesa,
                            apellido: nombreFamilia,
                            willAssist: miembro.willAssist,
                        },
                        {
                            where: { id: miembro.id },
                            transaction: p,
                        }
                    );
                    await p.commit();
                } catch (err) {
                    await p.rollback();
                    throw err;
                }
            }
        }

        // Emitimos el evento global y respondemos
        connectionEmitter.emit('familiaModificada', familia);
        res.status(200).json({
            message:
                'Familia actualizada y miembros sincronizados correctamente',
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
};

module.exports = { getAllFamiles, registrarFamilia, buscarFamilia, borrarFamilia, buscarPorCualquierMiembro, setConfirmation, setInvitationViewed,asignacionDeMesas, modificarFamilia }

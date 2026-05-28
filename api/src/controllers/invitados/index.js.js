const { Invitado, Familia, conn } = require('../../db');
const {io} = require('../../config/websocketConfig');
const connectionEmitter = require('../../config/emmiter');
const { Op } = require('sequelize');

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
                    'nombreCompleto',
                ],
            },
        });
        res.status(200).json(familias);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const registrarFamilia = async (req, res) => {
    const t = await conn.transaction();

    try {
        const { apellido, invitados } = req.body;

        // 1. Crear la Familia
        const familia = await Familia.create(
            {
                apellido,
                pases: invitados.length,
            },

            { transaction: t, include: { all: true, nested: true } }
        );
        await t.commit();

        // 2. Preparar los invitados con el ID de la familia recién creada
        if (invitados.length >= 1) {
            invitados.forEach(async (invitado) => {
                const p = await conn.transaction();
                const mienbro = await Invitado.create(
                    {
                        ...invitado,
                        apellido: familia.apellido,
                        familia_Id: familia.id,
                    },
                    {
                        transaction: p,
                        include: { all: true, nested: true },
                    }
                );

                await familia.addMiembro(mienbro);
                await p.commit();
            });
        }
      req.io.emit('newFamilyCreated', familia);

        res.status(201).json({
            message: 'Familia e invitados creados',
            familia,
        });
    } catch (error) {
        console.error(error);
        await t.rollback();
        res.status(500).json({ error: error.message });
    }
};

const buscarPorCualquierMiembro = async (req, res) => {
    const { nombre } = req.query;
    try {
        const resultados = await Invitado.findAll({
            where: {
                [Op.or]: [
                    { nombre: { [Op.like]: `%${nombre}%` } },
                    { apellido: { [Op.like]: `%${nombre}%` } },
                ],
            },
            include: {
                all: true,
                nested: true,
            },
        });

        res.status(200).json(resultados);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

async function buscarFamilia(req, res) {
    const { id } = req.params;
    try {
        const familia = await Familia.findByPk(id, {
            include: {
                all: true,
                nested: true,
            },
        });
        res.status(200).json(familia);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

async function borrarFamilia(req, res) {
    const { id } = req.params;
    const { conserveMensajes } = req.query;

    try {
        const familia = await Familia.findByPk(id);
        if (!familia) {
            return res.status(404).json({ error: 'Familia no encontrada' });
        }
        const miembros = await familia.getMiembros();
        const mensajes = await familia.getMensajes();

        for (const miembro of miembros) {
            await miembro.destroy();
        }
        if (!conserveMensajes || conserveMensajes === 'false') {
            for (const mensaje of mensajes) {
                await mensaje.destroy();
            }
        }
        req.io.to('/Admins').emit('newFamilyDeleted', familia);
        await familia.destroy();
        
        res.status(200).json({ message: 'Familia borrada' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

async function setConfirmation(req, res) {
    const { invitados } = req.body;

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
            for (const asistente of invitados.willAssist) {
                const findAssist = await Invitado.findByPk(asistente, {
                    include: {
                        all: true,
                        nested: true,
                    },
                });
                connectionEmitter.emit('crearNotificacion', {
                    mensaje: `${findAssist.nombreCompleto} asistirá`,
                });
            }
        }

        // 2. Procesar los que NO asisten
        if (invitados && invitados.wontAssist) {
            await Invitado.update(
                {
                    willAssist: 'Rechazada',
                    confirmationDate: null,
                    // <-- En formato de texto ISO
                },
                { where: { id: invitados.wontAssist } }
            );
            for (const rechazado of invitados.wontAssist) {
                const findRechazo = await Invitado.findByPk(rechazado, {
                    include: {
                        all: true,
                        nested: true,
                    },
                });
                connectionEmitter.emit('crearNotificacion', {
                    mensaje: `${findRechazo.nombreCompleto} rechazó la invitación`,
                });
            }
        }
        const families = await Familia.findAll({
            include: {
                all: true,
                nested: true,
            },
        });
        req.io.to("/Admins").emit('newConfirmation', families);

        return res
            .status(200)
            .json({ message: 'Invitaciones actualizadas con éxito' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: error.message });
    }
}

async function setInvitationViewed(req, res) {
    const { familiaId } = req.query;
    try {
        await Familia.update(
            {
                hasViewed: true,
            },
            {
                where: {
                    id: familiaId,
                },
            }
        );
        req.io.to('/Admins').emit('newInvitationViewed', familiaId);

        res.status(200).json({
            message: 'Familia actualizada',
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

async function asignacionDeMesas(req, res) {
    const { familias } = req.body;

    // 1. Iniciamos la transacción única para todo el proceso
    const t = await conn.transaction();

    try {
        // Usamos un Set para almacenar los IDs únicos de las familias afectadas
        const familiasModificadasIds = new Set();

        // 2. Recorremos los datos y ejecutamos las actualizaciones
        for (const familia of familias) {
            for (const miembro of familia.miembros) {
                const [filasAfectadas] = await Invitado.update(
                    { mesa: miembro.mesa },
                    {
                        where: {
                            id: miembro.id,
                            mesa: {
                                [Op.ne]: miembro.mesa,
                               
                            },
                        },
                        transaction: t,
                    }
                );

                // Si realmente se actualizó una fila, guardamos el ID de su familia
                if (filasAfectadas > 0) {
                    familiasModificadasIds.add(familia.id); // Asumiendo que viene 'familia.id' en el req.body
                }
            }
        }

        // 3. Si todo salió bien, confirmamos los cambios en la base de datos
        await t.commit();

        // 4. Notificamos SOLO a las familias que realmente cambiaron
        if (familiasModificadasIds.size > 0) {
            // Convertimos el Set a un Array usando el operador spread [...]
            const familiasActualizadas = await Familia.findAll({
                where: {
                    id: [...familiasModificadasIds],
                },
                    include: {
                        all: true,
                        nested: true,
                    },
                
            });
            for (const midFam of familiasActualizadas) {// Emitimos el evento con los datos reales de la DB
                req.io.to(`/${midFam.id}`).emit('notificacion_mesa_asignada', midFam);

            }

            return res.status(200).json({
                message: 'Mesas actualizadas con éxito',
                familiasAfectadas: familiasActualizadas.length,
            });
        }

        // Si los bucles corrieron pero nadie cambió de mesa realmente
        return res
            .status(200)
            .json({ message: 'No hubo cambios en las mesas' });
    } catch (error) {
        // 5. Si algo falla, deshacemos absolutamente todo lo hecho en esta tanda
        await t.rollback();

        console.error('Error en asignacionDeMesas:', error);
        return res.status(500).json({ error: error.message });
    }
}
const modificarFamilia = async (req, res) => {
    try {
        const { id, nombreFamilia, invitados } = req.body;

        // 1. Buscamos la instancia de la familia
        const familia = await Familia.findByPk(id, {
            include: { all: true, nested: true },
        });
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
        await familia.reload({ include: { all: true, nested: true } });

        // Emitimos el evento global y respondemos
       req.io.to('Admins').emit('newFamilyModified', familia);
        res.status(200).json({
            message:
                'Familia actualizada y miembros sincronizados correctamente',
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    getAllFamiles,
    registrarFamilia,
    buscarFamilia,
    borrarFamilia,
    buscarPorCualquierMiembro,
    setConfirmation,
    setInvitationViewed,
    asignacionDeMesas,
    modificarFamilia,
};

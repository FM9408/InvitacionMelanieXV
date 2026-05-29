const { DataTypes} = require("sequelize");


module.exports = (sequelize) => {
    sequelize.define(
        'notificacion',
        {
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },
            mensaje: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            fecha: {
                type: DataTypes.DATE,
                allowNull: false,
                defaultValue: Date.now(),
            },
            creadaHace: {
                type: DataTypes.VIRTUAL,
                get() {
                    // Aseguramos obtener los milisegundos del campo 'enviado'
                    const timestamp = new Date(this.fecha).getTime();
                    if (isNaN(timestamp)) return 'Fecha inválida';

                    // Calculamos la diferencia en segundos
                    const diferenciaSegundos = Math.floor(
                        (Date.now() - timestamp) / 1000
                    );

                    if (diferenciaSegundos < 60) {
                        return 'Hace un momento';
                    }

                    const minutos = Math.floor(diferenciaSegundos / 60);
                    if (minutos < 60) {
                        return `Hace ${minutos} ${minutos === 1 ? 'minuto' : 'minutos'}`;
                    }

                    const horas = Math.floor(minutos / 60);
                    if (horas < 24) {
                        return `Hace ${horas} ${horas === 1 ? 'hora' : 'horas'}`;
                    }

                    const dias = Math.floor(horas / 24);
                    if (dias < 30) {
                        return `Hace ${dias} ${dias === 1 ? 'día' : 'días'}`;
                    }

                    const meses = Math.floor(dias / 30);
                    return `Hace ${meses} ${meses === 1 ? 'mes' : 'meses'}`;
                },
            },
        },
        {
            timestamps: false,
            paranoid: true,
        }
    );};
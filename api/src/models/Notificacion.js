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
                    const timestamp = new Date(this.fecha).getTime();

                    return Math.floor((Date.now() - timestamp) / 60000);
                },
            },
        },
        {
            timestamps: false,
            paranoid: true,
        }
    );};
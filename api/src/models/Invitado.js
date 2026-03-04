const {DataTypes} = require('sequelize');


module.exports = (sequelize) => {
    sequelize.define("invitado", {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV1,
            allowNull: false,
            primaryKey: true
        },
        nombre: {
            type: DataTypes.STRING,
            allowNull: false
        },
        apellido: {
            type: DataTypes.STRING,
            allowNull: false
        },
        nombreCompleto: {
            type: DataTypes.VIRTUAL,
            get() {
                return `${this.nombre} ${this.apellido}`;
            }
        }

    })
}
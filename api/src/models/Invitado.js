const { DataTypes, UUID, UUIDV1, UUIDV4 } = require('sequelize')
const { conn } = require('../db')

const invitadoModel = (sequelize) => {
    sequelize.define(
        'invitado',
        {
            id: {
                type: UUID,
                defaultValue: UUIDV4,
                allowNull: false,
                unique: true,
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
                    return `${this.nombre} ${this.apellido}`
                }
            },
            confirmationDate: {
                type: DataTypes.DATE,
                allowNull: true,
               
               
            },


            mesa: {
                type: DataTypes.INTEGER,
                allowNull: false,
                defaultValue: 0
            },
            willAssist: {
                type: DataTypes.STRING,
                defaultValue: "Pendiente"
            },
           
          
        },
        {
            timestamps: false,
            onUpdate: "CASCADE",
            onDelete: "SET NULL"
           
            
        }
    )
}

module.exports = invitadoModel


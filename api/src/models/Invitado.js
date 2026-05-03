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
            // nombreCompleto: {
            //     type: DataTypes.VIRTUAL,
            //     get() {
            //         return `${this.nombre} ${this.apellido}`
            //     }
            // },

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
           
            
        }
    )
}

module.exports = invitadoModel


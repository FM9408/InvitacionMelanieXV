const { DataTypes, UUID, UUIDV1, UUIDV4,} = require('sequelize')

module.exports = (sequelize) => {
    sequelize.define(
        'familia',
        {
            id: {
                type: UUID,
                defaultValue: UUIDV4,
                unique: true,
                allowNull: false,
                primaryKey: true
            },
            apellido: {
                type: DataTypes.STRING,
                allowNull: false
            },
            pases: {
                type: DataTypes.INTEGER,
                allowNull: false,
                defaultValue: 0
            },
            hasViewed: {
                 type: DataTypes.BOOLEAN,
                 defaultValue: false
            }
        },
        {
            timestamps: false,
           
        }
    )
}

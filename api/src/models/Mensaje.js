const{ DataTypes, UUID, UUIDV1, UUIDV4}= require("sequelize")


module.exports = (sequelize) => {
    sequelize.define('mensaje', {
        id: {
            type: UUID,
            defaultValue: UUIDV4,
            allowNull: false,
            primaryKey: true
        },
        mensaje: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        enviado: {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: new Date(Date.now())

        },
        enviadoHace: {
            type: DataTypes.VIRTUAL,
            get() {
                const timestamp = new Date(this.enviado).getTime()
                console.log((Date.now() - timestamp) / 60000)
                return Math.floor((Date.now() - timestamp) / 60000) 
            }
        } 
        
    }, {
        timestamps: false,
        onUpdate: "CASCADE",
        onDelete: "SET NULL"

    })
}
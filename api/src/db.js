const { Sequelize } = require('sequelize')
const fs = require('node:fs')
const path = require('node:path')
const {
    DB_HOST,
    DB_NAME,
    DB_PASSWORD,
    DB_USER,
    DB_LOCAL_USER,
    DB_LOCAL_PASSWORD,
    DB_LOCAL_HOST,
    DB_LOCAL_NAME,
    NODE_ENV
} = process.env

const sequelizeConfig = {
    protocol: 'postgres',
    dialect: 'postgres',
    logging: false, // Desactiva logs de SQL en consola para ganar velocidad
    pool: {
        max: 5, // Cloud Run prefiere pocas conexiones por instancia
        min: 0,
        acquire: 30000,
        idle: 10000,
    },
    dialectOptions: {
        ssl: false,
    },
};

const sequelize =
    NODE_ENV === 'production' ?
        new Sequelize(DB_NAME, DB_USER, DB_PASSWORD, {
            host: DB_HOST,
            ...sequelizeConfig,
        })
    :   new Sequelize(DB_LOCAL_NAME, DB_LOCAL_USER, DB_LOCAL_PASSWORD, {
            host: DB_LOCAL_HOST,
            ...sequelizeConfig,
        });
const basename = path.basename(__filename)

const modelDefiners = []

// Leemos todos los archivos de la carpeta Models, los requerimos y agregamos al arreglo modelDefiners
fs.readdirSync(path.join(__dirname, '/models'))
    .filter(
        (file) =>
            file.indexOf('.') !== 0 &&
            file !== basename &&
            file.slice(-3) === '.js'
    )
    .forEach((file) => {
        modelDefiners.push(require(path.join(__dirname, '/models', file)))
    })

// Injectamos la conexion (sequelize) a todos los modelos
modelDefiners.forEach((model) => model(sequelize))
// Capitalizamos los nombres de los modelos ie: product => Product
let entries = Object.entries(sequelize.models)
let capsEntries = entries.map((entry) => [
    entry[0][0].toUpperCase() + entry[0].slice(1),
    entry[1]
])
sequelize.models = Object.fromEntries(capsEntries)

// En sequelize.models están todos los modelos importados como propiedades
// Para relacionarlos hacemos un destructuring
const { Invitado, Familia, Mensaje, Notificacion } = sequelize.models;

Familia.hasMany(Invitado, { as: 'miembros', foreignKey: 'familia_Id' })
Invitado.belongsTo(Familia, { foreignKey: 'familia_Id' })
Familia.hasMany(Mensaje, { as: "mensajes", foreignKey: "familia_Id" })
Mensaje.belongsTo(Familia, {foreignKey:"familia_Id"})

module.exports = {
    ...sequelize.models, // para poder importar los modelos así: const { Product, User } = require('./db.js');
    conn: sequelize // para importart la conexión { conn } = require('./db.js');
}

const { Sequelize } = require('sequelize');
const fs = require('node:fs');
const path = require('node:path');
const {
  DB_HOST,
  DB_NAME,
  DB_PASSWORD,
  DB_USER,
  DB_LOCAL_USER,
  DB_LOCAL_PASSWORD,
  DB_LOCAL_HOST,
  DB_LOCAL_NAME,
} = process.env;




const sequelize = process.env.NODE_ENV === 'production' ?
  new Sequelize({
    protocol: 'postgres',
    dialect: 'postgres',
    username: `${DB_USER}`,
    password: `${DB_PASSWORD}`,
    host: `${DB_HOST}`,
    database: `${DB_NAME}`,
    dialectOptions: {
      ssl: false
    }
  }) :
  new Sequelize({
    protocol: 'postgres',
    dialect: 'postgres',
    username: `${DB_LOCAL_USER}`,
    password: `${DB_LOCAL_PASSWORD}`,
    host: `${DB_LOCAL_HOST}`,
    database: `${DB_LOCAL_NAME}`,
    dialectOptions: {
      ssl: false
    },
  })

const basename = path.basename(__filename);

const modelDefiners = [];

// Leemos todos los archivos de la carpeta Models, los requerimos y agregamos al arreglo modelDefiners
fs.readdirSync(path.join(__dirname, '/models'))
  .filter((file) => (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js'))
  .forEach((file) =>
  {
    modelDefiners.push(require(path.join(__dirname, '/models', file)));
  });

// Injectamos la conexion (sequelize) a todos los modelos
modelDefiners.forEach(model => model(sequelize));
// Capitalizamos los nombres de los modelos ie: product => Product
let entries = Object.entries(sequelize.models);
let capsEntries = entries.map((entry) => [entry[0][0].toUpperCase() + entry[0].slice(1), entry[1]]);
sequelize.models = Object.fromEntries(capsEntries);

// En sequelize.models están todos los modelos importados como propiedades
// Para relacionarlos hacemos un destructuring
const { Invitado } = sequelize.models;


module.exports = {
  ...sequelize.models, // para poder importar los modelos así: const { Product, User } = require('./db.js');
  conn: sequelize,     // para importart la conexión { conn } = require('./db.js');
};
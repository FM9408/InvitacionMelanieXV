require("dotenv").config();
const {NODE_ENV} = process.env;
const api = require("./src/app");
const {conn} = require("./src/db.js");

const PORT = process.env.PORT || 3000;

api.listen(PORT, async() => {
    try {
        console.log("Conectando a la base de datos...");
        await conn.authenticate();
        console.log("Conexión exitosa a la base de datos");
        await conn.sync({force: NODE_ENV === "development", alter: NODE_ENV === "production", logging: NODE_ENV === "development" ? (logs) => {
            console.log("Base de datos sincronizada con éxito");
            console.log(logs);
        } : false});
        console.log(`Servidor escuchando en el puerto ${PORT}`);
    } catch (error) {
        console.error("Error al conectar a la base de datos:", error);
    
    }
});


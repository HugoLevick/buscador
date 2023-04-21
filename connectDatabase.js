const { MongoClient } = require("mongodb");
const cinema = require("./app");
require("dotenv").config();

async function connectDatabase() {
  const dbClient = new MongoClient(process.env.MONGO_URI);
  try {
    //Conectar a la base de datos
    await dbClient.connect();
    //Obtener la coleccion donde se guardan las peliculas
    const moviesColl = dbClient.db("cinema").collection("movies");
    console.log("Exported cinema");
    //Exportar la coleccion
    module.exports.cinema = moviesColl;
  } catch (e) {
    console.error(e);
  }
}

module.exports = connectDatabase;

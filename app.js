require("dotenv").config();
const express = require("express");
const connectDatabase = require("./connectDatabase");
const bodyParser = require("body-parser");

const app = express();
const port = process.env.PORT || 3000;
let cinema;

async function startServer() {
  if (!process.env.MONGO_URI)
    throw new Error("Por favor configura el archivo .env correctamente");

  //Llamar a la funcion conectar BD
  await connectDatabase();
  //Despues de su ejecucion, se importa la coleccion 'cinema'
  cinema = require("./connectDatabase").cinema;

  console.log("Conectado a la base de datos");

  //Importaciones que deben suceder despues de la coneccion a la BD
  const indexRouter = require("./routes/indexRouter");
  const peliculasRouter = require("./routes/peliculasRouter");

  app.use("/", indexRouter);
  app.use("/peliculas", peliculasRouter);

  app.use(bodyParser.json());
  app.use(express.static("public"));
  app.listen(port, () => {
    console.log(`App esuchando en puerto ${port}`);
  });
}

startServer();
module.exports = cinema;

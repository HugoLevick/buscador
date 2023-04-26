require("dotenv").config();
const express = require("express");
const connectDatabase = require("./connectDatabase");
const bodyParser = require("body-parser");
const usuariosRouter = require("./routes/usuariosRouter");
const indexRouter = require("./routes/indexRouter");
const peliculasRouter = require("./routes/peliculasRouter");
const peticionesRouter = require("./routes/peticionesRouter");
require("./auth/auth");

const app = express();
const port = process.env.PORT || 3000;
let cinema;

async function startServer() {
  if (!process.env.MONGO_URI)
    throw new Error("Por favor configura el archivo .env correctamente");

  //Llamar a la funcion conectar BD
  await connectDatabase();

  console.log("Conectado a la base de datos");

  app.use("/", indexRouter);
  app.use("/peliculas", peliculasRouter);
  app.use("/usuarios", usuariosRouter);
  app.use("/peticiones", peticionesRouter);

  app.use(bodyParser.json());
  app.use(express.static("public"));
  app.listen(port, () => {
    console.log(`App esuchando en puerto ${port}`);
  });
}

startServer();
module.exports = cinema;

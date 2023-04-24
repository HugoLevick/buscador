const express = require("express");
const bodyParser = require("body-parser");
//Usado para validacion de id
const ValidarMongoId = require("mongodb").ObjectId.isValid;
const movies = require("./schemas/pelicula.schema");

const peliculasRouter = express.Router();
peliculasRouter.use(bodyParser.json());

const peliculas = [
  {
    id: 1,
    nombre: "El Padrino",
    autor: "Francis Ford Coppola",
    fechaEstreno: 1972,
  },
  {
    id: 2,
    nombre: "Forrest Gump",
    autor: "Robert Zemeckis",
    fechaEstreno: 1994,
  },
  {
    id: 3,
    nombre: "La La Land",
    autor: "Damien Chazelle",
    fechaEstreno: 2016,
  },
  {
    id: 4,
    nombre: "El Señor de los Anillos: El Retorno del Rey",
    autor: "Peter Jackson",
    fechaEstreno: 2003,
  },
  {
    id: 5,
    nombre: "Titanic",
    autor: "James Cameron",
    fechaEstreno: 1997,
  },
  {
    id: 6,
    nombre: "Pulp Fiction",
    autor: "Quentin Tarantino",
    fechaEstreno: 1994,
  },
  {
    id: 7,
    nombre: "El Club de la Pelea",
    autor: "David Fincher",
    fechaEstreno: 1999,
  },
  {
    id: 8,
    nombre: "Blade Runner",
    autor: "Ridley Scott",
    fechaEstreno: 1982,
  },
  {
    id: 9,
    nombre: "Memento",
    autor: "Christopher Nolan",
    fechaEstreno: 2000,
  },
  {
    id: 10,
    nombre: "Star Wars: Episodio IV - Una Nueva Esperanza",
    autor: "George Lucas",
    fechaEstreno: 1977,
  },
];

// GET todas las peliculas
peliculasRouter.get("/", async function (req, res) {
  const search = req.query.s;
  res.send(
    await movies.find(
      search ? { titulo: new RegExp(`(.+)?${search}(.+)?`) } : undefined
    )
  );
});

async function encontrarPelicula(terminoBusqueda) {
  let pelicula;
  if (ValidarMongoId(terminoBusqueda))
    pelicula = await movies.findOne({ _id: terminoBusqueda });
  else pelicula = await movies.findOne({ titulo: terminoBusqueda });

  if (!pelicula) {
    throw new Error("Pelicula no encontrada");
  }

  return pelicula;
}

// GET pelicula por id o titulo
peliculasRouter.get("/:termino", async (req, res) => {
  try {
    const pelicula = await encontrarPelicula(req.params.termino);
    res.send(pelicula);
  } catch (error) {
    res.statusCode = 404;
    res.send({ message: "Pelicula no encontrada" });
  }
});

// POST nueva pelicula
peliculasRouter.post("/", async (req, res) => {
  if (!req.body) {
    res.statusCode = 400;
    res.send({
      message: "Se necesitan los siguientes campos: titulo, autor, estreno",
    });
    return;
  }

  const { titulo, autor, estreno } = req.body;

  if (
    typeof titulo !== "string" ||
    typeof autor !== "string" ||
    typeof estreno !== "number"
  ) {
    res.statusCode = 400;
    res.send({ message: "Algunos de los campos son incorrectos" });
    return;
  }

  try {
    const pelicula = await movies.create({
      titulo,
      autor,
      estreno,
    });
    res.statusCode = 201;
    res.send(pelicula);
  } catch (error) {
    //Duplicado
    if (error.code === 11000) {
      res.statusCode = 400;
      res.send({ message: "El titulo de la pelicula ya existe" });
    } else {
      res.statusCode = 500;
      res.send({ message: "Error de servidor" });
    }
  }
});

// DELETE pelicula
peliculasRouter.delete("/:id", async (req, res) => {
  let pelicula;
  try {
    pelicula = await encontrarPelicula(req.params.id);
    await movies.deleteOne({ _id: pelicula._id });
    res.send({ message: "Pelicula eliminada" });
  } catch (error) {
    res.statusCode = 404;
    res.send({ message: "Pelicula no encontrada" });
  }
});

module.exports = peliculasRouter;

const express = require("express");
const cinema = require("../connectDatabase").cinema;

const peliculasRouter = express.Router();

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
  res.send(peliculas);
  //res.send(await cinema.findOne({}));
});

peliculasRouter.get("/:id", async (req, res) => {
  const idPelicula = req.params.id;
  const pelicula = peliculas.find((p) => p.id == idPelicula);
  if (!pelicula) {
    res.statusCode = 404;
    res.send({ message: "Pelicula no encontrada" });
    return;
  }

  res.send(pelicula);
});

peliculasRouter.delete("/:id", async (req, res) => {
  res.send({ message: "Pelicula eliminada" });
});

// POST nueva pelicula
peliculasRouter.post("/", async (req, res) => {
  // await cinema.insertOne({
  //   titulo: "test1",
  //   autor: "Test4",
  //   estreno: "Test5",
  // });

  res.statusCode = 201;
  res.send({ message: "Pelicula creada" });
});

module.exports = peliculasRouter;

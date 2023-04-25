const express = require("express");
const passport = require("passport");
const bodyParser = require("body-parser");
//Usado para validacion de id
const ValidarMongoId = require("mongodb").ObjectId.isValid;
const movies = require("../model/Pelicula");

const peliculasRouter = express.Router();
peliculasRouter.use(bodyParser.json());

// GET todas las peliculas
peliculasRouter.get("/", async function (req, res) {
  const search = req.query.s;
  res.send(
    await movies.find(
      //prettier-ignore
      search
      ? { titulo: new RegExp(`(.+)?${search}(.+)?`, "i") }
      : undefined
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
peliculasRouter.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
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
        usuario_id: req.user._id,
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
        console.log(error);
        res.send({ message: "Error de servidor" });
      }
    }
  }
);

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

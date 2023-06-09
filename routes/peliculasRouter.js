const express = require("express");
const passport = require("passport");
const bodyParser = require("body-parser");
//Usado para validacion de id
const ValidarMongoId = require("mongodb").ObjectId.isValid;
const movies = require("../model/Pelicula");
const requests = require("../model/Solicitudes");

const peliculasRouter = express.Router();
peliculasRouter.use(bodyParser.json());

// GET todas las peliculas
peliculasRouter.get("/", async function (req, res) {
  if (req.query.fromUser) {
    res.send(await movies.find({ usuario_id: req.query.fromUser }));
    return;
  }

  const search = req.query.s
    ?.replace(/\./g, "\\.")
    .replace(/\\/g, "\\\\")
    .replace(/\(/g, "\\(")
    .replace(/\)/g, "\\)")
    .replace(/\*/g, "\\*")
    .replace(/\+/g, "\\+")
    .replace(/\?/g, "\\?");

  try {
    res.send(
      await movies.find(
        //prettier-ignore
        search
          ? { titulo: new RegExp(`(.+)?${search}(.+)?`, "i") }
          : undefined
      )
    );
  } catch (error) {
    res.status(500).send({ message: "Error de servidor" });
  }
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

// POST nueva pelicula (auth)
peliculasRouter.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    if (!req.body) {
      res.statusCode = 400;
      res.send({
        message: "Se necesitan los siguientes campos: titulo, actores, estreno",
      });
      return;
    }

    const { titulo, actores, estreno, url } = req.body;

    if (
      typeof titulo !== "string" ||
      typeof actores !== "string" ||
      typeof estreno !== "number"
    ) {
      res.statusCode = 400;
      res.send({ message: "Algunos de los campos son incorrectos" });
      return;
    }

    try {
      const pelicula = await movies.create({
        titulo,
        actores,
        estreno,
        url,
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

// DELETE pelicula (auth)
peliculasRouter.delete(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    let pelicula;
    try {
      pelicula = await encontrarPelicula(req.params.id);
      if (
        pelicula.usuario_id === req.user._id.toHexString() ||
        req.user.rol === "ADMIN"
      ) {
        if (req.user.rol === "USUARIO") {
          const solicitudPrevia = await requests.findOne({
            "pelicula._id": pelicula._id,
          });
          if (solicitudPrevia) {
            res.statusCode = 400;
            return res.send({
              message: "Esta pelicula ya tiene una solicitud de eliminacion",
            });
          }
          await requests.create({
            pelicula,
            solicitante_id: req.user._id,
          });
          return res.send({ message: "Pelicula solicitada para eliminacion" });
        } else {
          await movies.deleteOne({ _id: pelicula._id });
          await requests.deleteOne({ "pelicula._id": pelicula._id });
          return res.send({ message: "Pelicula eliminada" });
        }
      } else {
        res.statusCode = 401;
        res.send({ message: "No tienes permiso para borrar esta pelicula" });
      }
    } catch (error) {
      console.log(error);
      res.statusCode = 404;
      res.send({ message: "Pelicula no encontrada" });
    }
  }
);

module.exports = peliculasRouter;

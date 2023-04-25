require("dotenv").config();
const express = require("express");
const passport = require("passport");
const jwt = require("jsonwebtoken");
const bodyParser = require("body-parser");
//Usado para validacion de id
const ValidarMongoId = require("mongodb").ObjectId.isValid;
const users = require("../model/Usuario");

const usuariosRouter = express.Router();
usuariosRouter.use(bodyParser.json());

// GET todas las peliculas
//prettier-ignore
usuariosRouter.post("/signup",
    passport.authenticate("signup", { session: false }), async (req, res, next) => {
        res.send({ message: "Cuenta creada exitosamente", user: req.user });
    }
);

//prettier-ignore
usuariosRouter.post("/login", async (req, res, next) => {

    passport.authenticate("login", { session: false }, async (err, user) => {
        if(err || !user) return next(new Error("Autenticacion fallida"));
        try {
            req.login(user, {session: false } , async (err) => {
                if(err) return next(err);
                const body = { _id: user.id, email: user.email};
                const token = jwt.sign({user: body}, process.env.JWT_SECRET);
                return res.json({ token });
            })
        } catch (error) {
            return next(error)
        }
    })(req, res, next)
});

//prettier-ignore
usuariosRouter.get( "/perfil", passport.authenticate("jwt", { session: false }),
  async (req, res, next) => {
    res.send({
      message: "Autenticado",
      user: req.user,
    })
  }
);

module.exports = usuariosRouter;
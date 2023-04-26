const express = require("express");
const passport = require("passport");
const requests = require("../model/Solicitudes");

const peticionesRouter = express.Router();

peticionesRouter.get(
  "/",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    if (req.user.rol !== "ADMIN") {
      res.status = 401;
      res.send("Unauthorized");
      return;
    }

    const peticiones = await requests.find({});
    return res.send(peticiones);
  }
);

module.exports = peticionesRouter;

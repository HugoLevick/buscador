const express = require("express");
const indexRouter = express.Router();

/* GET home page. */
indexRouter.get("/test", function (req, res, next) {
  res.send({ title: "Express" });
});

module.exports = indexRouter;

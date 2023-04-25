const { Schema, model } = require("mongoose");

const MovieSchema = new Schema({
  titulo: {
    type: String,
    required: true,
    unique: true,
  },

  autor: {
    type: String,
    required: true,
  },

  estreno: {
    type: Number,
    required: true,
  },
});

module.exports = model("Movie", MovieSchema);

const { Schema, model } = require("mongoose");

const MovieSchema = new Schema({
  titulo: {
    type: String,
    required: true,
    unique: true,
  },

  actores: {
    type: String,
    required: true,
  },

  estreno: {
    type: Number,
    required: true,
  },

  usuario_id: {
    type: String,
    required: true,
  },

  url: {
    type: String,
    default:
      "https://static.vecteezy.com/system/resources/previews/005/337/799/original/icon-image-not-found-free-vector.jpg",
  },
});

module.exports = model("Movie", MovieSchema);

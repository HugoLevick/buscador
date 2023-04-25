const { Schema, model } = require("mongoose");

const RequestSchema = new Schema({
  solicitante_id: {
    type: String,
    required: true,
    unique: true,
  },

  pelicula_id: {
    type: String,
    required: true,
  },
});

module.exports = model("Requests", RequestSchema);

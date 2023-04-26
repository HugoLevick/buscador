const { Schema, model } = require("mongoose");

const RequestSchema = new Schema({
  solicitante_id: {
    type: String,
    required: true,
  },

  pelicula: {
    type: Object,
    required: true,
    unique: true,
  },
});

module.exports = model("Requests", RequestSchema);

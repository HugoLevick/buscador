require("dotenv").config();
const mongoose = require("mongoose");
const movies = require("./model/Pelicula");

async function connectDatabase() {
  try {
    //Conectar a la base de datos MongoDB
    await mongoose.connect(process.env.MONGO_URI, {
      useUnifiedTopology: true,
      useNewUrlParser: true,
    });
  } catch (e) {
    console.error(e);
  }
}

module.exports = connectDatabase;

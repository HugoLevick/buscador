const { Schema, model } = require("mongoose");
const bcrypt = require("bcrypt");

const UserSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },

  password: {
    type: String,
    required: true,
  },

  name: {
    type: String,
    required: true,
  },

  rol: {
    type: String,
  },
});

UserSchema.pre("save", async function (next) {
  if (!this.rol) this.rol = "USUARIO";
  this.password = bcrypt.hashSync(this.password, 10);
  next();
});

UserSchema.methods.validatePassword = function (password) {
  const user = this;
  const compare = bcrypt.compareSync(password, user.password);
  return compare;
};

module.exports = model("User", UserSchema);

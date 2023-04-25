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
});

UserSchema.pre("save", async function (next) {
  this.password = bcrypt.hashSync(this.password, 10);
  next();
});

UserSchema.methods.validatePassword = async function (password) {
  const user = this;
  const compare = bcrypt.compareSync(password, user.password);
  return compare;
};

module.exports = model("User", UserSchema);

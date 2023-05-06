const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema(
  {
    userName: {
      type: String,
      require: true,
      unique: true,
    },
    email: {
      type: String,
      require: true,
      unique: true,
    },
    password: {
      type: String,
      require: true,
    },
    rePassword: {
      type: String,
      require: true,
    },
    phone: {
      type: String,
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
  },

  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", UserSchema);

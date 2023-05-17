const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ColorSchema = new Schema(
  {
    colorCode: {
      type: String,
      require: true,
      unique: true,
    },
    colorName: {
      type: String,
      require: true,
      unique: true,
    },
  },
  {
    timestamps: true,
  }
);

const Color = mongoose.model("Color", ColorSchema);
module.exports = Color;

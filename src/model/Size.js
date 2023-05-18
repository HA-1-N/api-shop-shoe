const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const SizeSchema = new Schema(
  {
    sizeCode: {
      type: String,
      require: true,
      unique: true,
    },
    sizeName: {
      type: String,
      require: true,
      unique: true,
    },
  },
  {
    timestamps: true,
  }
);

const Size = mongoose.model("Size", SizeSchema);
module.exports = Size;

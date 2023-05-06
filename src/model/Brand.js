const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const BrandSchema = new Schema(
  {
    brandCode: {
      type: String,
      require: true,
      unique: true,
    },
    name: {
      type: String,
      require: true,
      unique: true,
    },
  },
  {
    timestamps: true,
  }
);

const Brand = mongoose.model("Brand", BrandSchema);
module.exports = Brand;

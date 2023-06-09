const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema(
  {
    productCode: {
      type: String,
      required: true,
      unique: true,
    },

    brandCode: {
      type: String,
      required: true,
      ref: "Brand",
    },

    image: {
      type: Array,
      require: true,
    },

    name: {
      type: String,
      required: true,
    },

    size: {
      type: Array,
    },

    color: {
      type: Array,
    },

    price: {
      type: Number,
      required: true,
    },

    categories: {
      type: Array,
    },

    description: {
      type: String,
    },

    inStock: {
      type: Boolean,
      default: true,
    },
  },

  {
    timestamps: true,
  }
);

ProductSchema.virtual("brand", {
  ref: "Brand",
  localField: "brandCode",
  foreignField: "brandCode",
  justOne: true,
});

module.exports = mongoose.model("Product", ProductSchema);

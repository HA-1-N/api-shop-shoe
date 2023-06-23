const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CartSchema = new Schema(
  {
    orderBy: {
      type: String,
      // required: true,
      ref: "User",
    },
    products: [
      {
        productCode: {
          type: String,
          ref: "Product",
        },
        product: {
          type: Object,
          ref: "Product",
        },
        count: Number,
        color: String,
        price: Number,
        size: String,
      },
    ],
    cartTotal: Number,
    totalAfterDiscount: Number,
  },
  { timestamps: true }
);

CartSchema.virtual("user", {
  ref: "User",
  localField: "orderBy",
  foreignField: "_id",
  justOne: true,
});

CartSchema.virtual("product", {
  ref: "Product",
  localField: "productCode",
  foreignField: "productCode",
  justOne: true,
});

module.exports = mongoose.model("Cart", CartSchema);

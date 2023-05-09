const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CartSchema = new Schema(
  {
    orderBy: {
      type: String,
      required: true,
      ref: "User",
    },
    products: [
      {
        product: {
          type: String,
          ref: "Product",
        },
        count: Number,
        color: String,
        price: Number,
      },
    ],
    cartTotal: Number,
    totalAfterDiscount: Number,
  },
  { timestamps: true }
);

Cart.virtual("user", {
  ref: "User",
  localField: "orderBy",
  foreignField: "userName",
  justOne: true,
});

Cart.virtual("product", {
  ref: "Product",
  localField: "product",
  foreignField: "productCode",
  justOne: true,
});

module.exports = mongoose.model("Cart", CartSchema);

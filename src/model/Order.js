const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const OrderSchema = new Schema(
  {
    products: [
      {
        product: {
          type: String,
          ref: "Product",
        },
        count: Number,
        color: String,
      },
    ],
    paymentIntent: {},
    orderStatus: {
      type: String,
      default: "Not Processed",
      enum: [
        "Not Processed",
        "Cash on Delivery",
        "Processing",
        "Dispatched",
        "Cancelled",
        "Delivered",
      ],
    },
    orderby: {
      type: String,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

OrderSchema.virtual("user", {
  ref: "User",
  localField: "orderBy",
  foreignField: "userName",
  justOne: true,
});

OrderSchema.virtual("product", {
  ref: "Product",
  localField: "product",
  foreignField: "productCode",
  justOne: true,
});

module.exports = mongoose.model("Order", OrderSchema);

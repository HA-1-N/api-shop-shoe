const { string } = require("joi");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const OrderSchema = new Schema(
  {
    orderby: {
      type: String,
      ref: "User",
    },
    products: {
      type: Array,
    },
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
    address: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

OrderSchema.virtual("user", {
  ref: "User",
  localField: "orderBy",
  foreignField: "_id",
  justOne: true,
});

OrderSchema.virtual("product", {
  ref: "Product",
  localField: "product",
  foreignField: "productCode",
  justOne: true,
});

module.exports = mongoose.model("Order", OrderSchema);

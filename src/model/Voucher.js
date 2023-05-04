const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const VoucherSchema = new Schema(
  {
    voucherCode: {
      type: String,
      required: true,
      unique: true,
    },
    discount: {
      type: Number,
    },
  },
  {
    timestamps: true,
  }
);

const Voucher = mongoose.model("Voucher", VoucherSchema);
module.exports = Voucher;

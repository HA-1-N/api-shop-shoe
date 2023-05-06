const express = require("express");
const { json } = require("express");
const {
  createVoucher,
  updateVoucher,
  filterVoucher,
  deleteVoucher,
} = require("../../controller/voucher-controller/VoucherController");
const router = express.Router();
router.post("/create", createVoucher);
router.post("/update/:voucherCode", updateVoucher);
router.post("/filter", filterVoucher);
router.post("/delete", deleteVoucher);

module.exports = router;

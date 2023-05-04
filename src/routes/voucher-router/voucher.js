const express = require("express");
const { json } = require("express");
const {
  createVoucher,
} = require("../../controller/voucher-controller/VoucherController");
const router = express.Router();
router.post("/create", createVoucher);

module.exports = router;

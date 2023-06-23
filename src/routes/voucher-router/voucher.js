const express = require("express");
const { json } = require("express");
const {
  createVoucher,
  updateVoucher,
  filterVoucher,
  deleteVoucher,
  getVoucherByCode,
} = require("../../controller/voucher-controller/VoucherController");
const { verifyTokenAndAdmin } = require("../../middlewares/auth/authorization");
const router = express.Router();
router.post("/create", verifyTokenAndAdmin, createVoucher);
router.post("/update/:voucherCode", verifyTokenAndAdmin, updateVoucher);
router.post("/filter", filterVoucher);
router.post("/delete", verifyTokenAndAdmin, deleteVoucher);
router.post("/getVoucherByCode", getVoucherByCode);

module.exports = router;

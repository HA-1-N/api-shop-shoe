const express = require("express");
const {
  userAddToCart,
  getUserCart,
  emptyCart,
  addVoucher,
  updateCart,
} = require("../../controller/cart-controller/CartController");
const {
  verifyToken,
  verifyTokenAndAuthorization,
  verifyTokenAndAdmin,
} = require("../../middlewares/auth/authorization");

const router = express.Router();

router.post("/userCart", verifyToken, userAddToCart);
router.get("/getUserCart", verifyToken, getUserCart);
router.delete("/empty-cart", verifyToken, emptyCart);
router.post("/apply-voucher", verifyToken, addVoucher);
router.post("/update-cart", verifyToken, updateCart);

module.exports = router;

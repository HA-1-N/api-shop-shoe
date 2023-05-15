const express = require("express");
const {
  userAddToCart,
  getUserCart,
  emptyCart,
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

module.exports = router;

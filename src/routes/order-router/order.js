const express = require("express");
const {
  createOder,
  getOrders,
  updateOrderStatus,
  getAllOrders,
  getOrderById,
} = require("../../controller/order-controller/OrderController");
const router = express.Router();

const {
  verifyToken,
  verifyTokenAndAuthorization,
  verifyTokenAndAdmin,
} = require("../../middlewares/auth/authorization");

router.post("/create", verifyToken, createOder);
router.get("/get-orders", verifyToken, getOrders);
router.post("/get-orders-user-id/:id", verifyTokenAndAdmin, getOrderById);
router.get("/get-all-orders", verifyTokenAndAdmin, getAllOrders);
router.put("/update-order-status/:id", verifyToken, updateOrderStatus);

module.exports = router;

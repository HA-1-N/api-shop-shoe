const express = require("express");
const { json } = require("express");
const {
  createProduct,
  filterProduct,
  updateProduct,
  deleteProduct,
} = require("../../controller/product-controller/ProductController");
const {
  verifyToken,
  verifyTokenAndAdmin,
} = require("../../middlewares/auth/authorization");

const router = express.Router();
router.post("/create", verifyTokenAndAdmin, createProduct);
router.post("/filter", filterProduct);
router.post("/update/:productCode", verifyTokenAndAdmin, updateProduct);
router.post("/delete", verifyTokenAndAdmin, deleteProduct);

module.exports = router;

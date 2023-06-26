const express = require("express");
const { json } = require("express");
const {
  createProduct,
  filterProduct,
  updateProduct,
  deleteProduct,
  findProductByProductCode,
} = require("../../controller/product-controller/ProductController");
const {
  verifyToken,
  verifyTokenAndAdmin,
} = require("../../middlewares/auth/authorization");
const { upload } = require("../../middlewares/upload/upload");

const router = express.Router();
router.post(
  "/create",
  verifyTokenAndAdmin,
  upload.array("image", 5),
  createProduct
);
router.post("/filter", filterProduct);
router.get("/:productCode", findProductByProductCode);
router.post(
  "/update/:productCode",
  verifyTokenAndAdmin,
  upload.array("image", 5),
  updateProduct
);
router.post("/delete", verifyTokenAndAdmin, deleteProduct);

module.exports = router;

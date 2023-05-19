const express = require("express");
const { json } = require("express");
const {
  createBrand,
  updateBrand,
  deleteBrand,
  filterBrand,
  getBrandByCode,
} = require("../../controller/brand-controller/BrandController");
const {
  verifyToken,
  verifyTokenAndAdmin,
} = require("../../middlewares/auth/authorization");

const router = express.Router();

router.post("/create", verifyTokenAndAdmin, createBrand);
router.post("/filter", verifyTokenAndAdmin, filterBrand);
router.put("/update/:brandCode", verifyTokenAndAdmin, updateBrand);
router.post("/delete", verifyTokenAndAdmin, deleteBrand);
router.post("/getBrandByCode", verifyTokenAndAdmin, getBrandByCode);

module.exports = router;

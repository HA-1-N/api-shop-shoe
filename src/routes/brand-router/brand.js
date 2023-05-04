const express = require("express");
const { json } = require("express");
const {
  createBrand,
  updateBrand,
} = require("../../controller/brand-controller/BrandController");
const router = express.Router();

router.post("/create", createBrand);
router.put("/update/:brandCode", updateBrand);

module.exports = router;

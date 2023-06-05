const express = require("express");
const { json } = require("express");
const {
  createColor,
  filterColor,
  updateColor,
  deleteColor,
  getColorByCode,
} = require("../../controller/color-controller/ColorController");
const { verifyTokenAndAdmin } = require("../../middlewares/auth/authorization");

const router = express.Router();

router.post("/create", verifyTokenAndAdmin, createColor);
router.post("/filter", filterColor);
router.post("/update/:colorCode", verifyTokenAndAdmin, updateColor);
router.post("/delete", verifyTokenAndAdmin, deleteColor);
router.post("/getColorByCode", verifyTokenAndAdmin, getColorByCode);

module.exports = router;

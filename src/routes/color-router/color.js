const express = require("express");
const { json } = require("express");
const {
  createColor,
  filterColor,
} = require("../../controller/color-controller/ColorController");
const { verifyTokenAndAdmin } = require("../../middlewares/auth/authorization");

const router = express.Router();

router.post("/create", verifyTokenAndAdmin, createColor);
router.post("/filter", verifyTokenAndAdmin, filterColor);

module.exports = router;

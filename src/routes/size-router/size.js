const { json } = require("express");
const express = require("express");
const {
  createSize,
  filterSize,
} = require("../../controller/size-controller/SizeController");
const {
  verifyToken,
  verifyTokenAndAdmin,
} = require("../../middlewares/auth/authorization");
const router = express.Router();

router.post("/create", verifyTokenAndAdmin, createSize);
router.post("/filter", verifyTokenAndAdmin, filterSize);

module.exports = router;

const { json } = require("express");
const express = require("express");
const {
  createSize,
  filterSize,
  updateSize,
  deleteSize,
  getSizeByCode,
} = require("../../controller/size-controller/SizeController");
const {
  verifyToken,
  verifyTokenAndAdmin,
} = require("../../middlewares/auth/authorization");
const router = express.Router();

router.post("/create", verifyTokenAndAdmin, createSize);
router.post("/filter", filterSize);
router.post("/update/:sizeCode", verifyTokenAndAdmin, updateSize);
router.post("/delete", verifyTokenAndAdmin, deleteSize);
router.post("/getSizeByCode", verifyTokenAndAdmin, getSizeByCode);

module.exports = router;

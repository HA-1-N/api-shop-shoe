const express = require("express");
const { json } = require("express");
const {
  createCategory,
  filterCategory,
} = require("../../controller/category-controller/CategoryController");
const { verifyTokenAndAdmin } = require("../../middlewares/auth/authorization");

const router = express.Router();
router.post("/create", verifyTokenAndAdmin, createCategory);
router.post("/filter", verifyTokenAndAdmin, filterCategory);
module.exports = router;

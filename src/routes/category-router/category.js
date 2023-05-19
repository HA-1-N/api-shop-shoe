const express = require("express");
const { json } = require("express");
const {
  createCategory,
  filterCategory,
  updateCategory,
  deleteCategory,
  getCategoryByName,
} = require("../../controller/category-controller/CategoryController");
const { verifyTokenAndAdmin } = require("../../middlewares/auth/authorization");

const router = express.Router();
router.post("/create", verifyTokenAndAdmin, createCategory);
router.post("/filter", verifyTokenAndAdmin, filterCategory);
router.post("/update/:id", verifyTokenAndAdmin, updateCategory);
router.post("/delete", verifyTokenAndAdmin, deleteCategory);
router.post("/getCategoryByName", verifyTokenAndAdmin, getCategoryByName);

module.exports = router;

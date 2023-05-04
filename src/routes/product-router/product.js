const express = require("express");
const { json } = require("express");
const {
  createProduct,
} = require("../../controller/product-controller/ProductController");

const router = express.Router();
router.post("/create", createProduct);

module.exports = router;

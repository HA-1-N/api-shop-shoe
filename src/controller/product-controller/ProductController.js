const Product = require("../../model/Product");

const router = require("express").Router();

// CREATE
const createProduct = async (req, res) => {
  const newProduct = new Product(req.body);

  try {
    const savedProduct = await newProduct.save();
    res.status(200).json(savedProduct);
  } catch (error) {
    res.status(500).json(error);
  }
};

module.exports = {
  createProduct,
};

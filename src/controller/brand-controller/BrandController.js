const Brand = require("../../model/Brand");

const router = require("express").Router();

// CREATE
const createBrand = async (req, res) => {
  const newBrand = new Brand(req.body);
  try {
    const savedBrand = await newBrand.save();
    res.status(200).json(savedBrand);
  } catch (error) {
    res.status(500).json(error);
  }
};

// UPDATE
const updateBrand = async (req, res) => {
  try {
    const updateBrand = await Brand.findOneAndUpdate(
      req.params.brandCode,
      {
        $set: req.body,
      },
      { new: true }
    );
    res.status(200).json(updateBrand);
  } catch (error) {
    res.status(500).json(error);
  }
};

module.exports = {
  createBrand,
  updateBrand,
};

const Brand = require("../../model/Brand");
const {
  brandValidation,
} = require("../../validators/validationBrand/validationBrand");

const router = require("express").Router();

// CREATE
const createBrand = async (req, res) => {
  const { error } = brandValidation(req.body);

  if (error) {
    return res.status(400).send(error.details[0].message);
  }

  // Checking if brandCode is already in the database

  const brandCodeExist = await Brand.findOne({
    brandCode: req.body.brandCode,
  });

  if (brandCodeExist) {
    return res.status(400).send("brandCode is already");
  }

  // Checking if name is already in the database

  const nameExist = await Brand.findOne({
    name: req.body.name,
  });

  if (nameExist) {
    return res.status(400).send("name of brand is already");
  }

  const newBrand = new Brand(req.body);

  try {
    const savedBrand = await newBrand.save();
    return res
      .status(200)
      .json({ message: "Create brand successful !", data: savedBrand });
  } catch (error) {
    return res.status(500).json(error);
  }
};

// Filter
const filterBrand = async (req, res) => {
  try {
    const { brandCode, name } = req.body;
    // Extract pagination parameters from the request query string
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;

    // Build the MongoDB query object based on the filter criteria
    const query = {};
    if (brandCode) {
      query.brandCode = brandCode;
    }
    if (name) {
      query.name = name;
    }

    // Query the database for the filtered data
    const data = await Brand.find(query).skip(startIndex).limit(limit).exec();

    const count = await Brand.countDocuments(query);

    const response = {
      data,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(count / limit),
        totalItems: count,
      },
    };

    return res.status(200).json(response);
  } catch (error) {
    return res.status(500).json({ error: "Internal server error" });
  }
};

// UPDATE
const updateBrand = async (req, res) => {
  const { error } = brandValidation(req.body);

  if (error) {
    return res.status(400).send({ message: error.details[0].message });
  }

  try {
    const updateBrand = await Brand.findOneAndUpdate(
      { brandCode: req.params.brandCode },
      {
        $set: req.body,
      },
      { new: true }
    );

    if (!updateBrand) {
      return res.status(404).send({ message: "Brand not found" });
    }
    return res
      .status(200)
      .json({ message: "Update brand successful !", data: updateBrand });
  } catch (error) {
    return res.status(500).json(error);
  }
};

// Delete
const deleteBrand = async (req, res) => {
  try {
    const brandCodeDelete = req.body.brandCode;
    const deletedBrand = await Brand.findOneAndDelete({
      brandCode: brandCodeDelete,
    });
    if (!deletedBrand) {
      return res.status(404).json({ message: "Brand not found !" });
    }

    return res
      .status(200)
      .json({ message: "Brand deleted successfully", data: deletedBrand });
  } catch (error) {
    return res.status(500).send({ message: "Internal server error" });
  }
};

// get brand by brandCode
const getBrandByCode = async (req, res) => {
  try {
    const brandCode = req.body.brandCode;
    const brand = await Brand.findOne({ brandCode });
    if (!brand) {
      return res.status(404).json({ message: "Brand not found !" });
    }
    return res.status(200).json(brand);
  } catch (error) {
    return res
      .status(500)
      .send({ message: "Internal server error", error: error });
  }
};

module.exports = {
  createBrand,
  filterBrand,
  updateBrand,
  deleteBrand,
  getBrandByCode,
};

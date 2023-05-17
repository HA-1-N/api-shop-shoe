const Product = require("../../model/Product");
const Brand = require("../../model/Brand");
const {
  productValidation,
} = require("../../validators/validatorProduct/validationProduct");

const router = require("express").Router();

// CREATE
const createProduct = async (req, res) => {
  const { error } = productValidation(req.body);

  if (error) {
    return res.status(400).send(error.details[0].message);
  }

  // Checking if productCode is already in the database

  const productCodeExist = await Product.findOne({
    productCode: req.body.productCode,
  });

  if (productCodeExist) {
    return res.status(400).send("productCode is already");
  }

  const brand = await Brand.findOne({
    brandCode: req.body.brandCode,
  });

  if (!brand) {
    return res.status(404).json({ message: "Brand not found" });
  }

  const newProduct = new Product({
    productCode: req.body.productCode,
    brandCode: req.body.brandCode,
    image: req.body.image,
    name: req.body.name,
    size: req.body.size,
    color: req.body.color,
    price: req.body.price,
    categories: req.body.categories,
    description: req.body.description,
  });

  try {
    const savedProduct = await newProduct.save();
    res.status(200).json({
      message: "Create product successfull !",
      data: {
        ...savedProduct._doc,
        brand: {
          brandCode: brand.brandCode,
          name: brand.name,
        },
      },
    });
  } catch (error) {
    res.status(500).json({ error: error, message: "Internal server error" });
  }
};

//Filter product
const filterProduct = async (req, res) => {
  try {
    // Get the filter criteria from the request body
    const { productCode, brandCode, name, color, size } = req.body;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;

    // Build the query based on the filter criteria
    const query = {};
    if (productCode) {
      query.productCode = productCode;
    }
    if (brandCode) {
      query.brandCode = brandCode;
    }
    if (name) {
      query.name = name;
    }

    if (color && color.length > 0) {
      query.color = { $in: color };
    }

    if (size && size.length > 0) {
      query.size = { $in: size };
    }

    // Query the database to find the matching products
    const products = await Product.find(query)
      .populate("brand")
      .sort({ createdAt: -1 })
      .skip(startIndex)
      .limit(limit)
      .exec();

    const count = await Product.countDocuments(query);

    const result = [];
    for (let index = 0; index < products.length; index++) {
      const product = products[index];
      const brand = await Brand.findOne({ brandCode: product.brandCode });

      const productInfo = {
        ...product._doc,
        brand: brand,
      };

      result.push(productInfo);
    }

    const response = {
      data: result,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(count / limit),
        totalItems: count,
      },
    };

    res.status(200).json(response);
  } catch (err) {
    // Return an error response if there was an error
    console.log("err...", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

// find product by id
const findProductByProductCode = async (req, res) => {
  try {
    const productCode = req.params.productCode;
    const product = await Product.findOne({ productCode });

    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    res.status(200).json(product);
  } catch (error) {
    res.status(200).json({ error: "Internal server error" });
  }
};

//Update product
const updateProduct = async (req, res) => {
  const { error } = productValidation(req.body);

  if (error) {
    return res.status(400).send({ message: error.details[0].message });
  }

  try {
    // Update the product in the database
    const product = await Product.findOneAndUpdate(
      { productCode: req.params.productCode },
      req.body,
      { new: true }
    );

    if (!product) {
      return res.status(404).send({ message: "Product not found" });
    }

    // Return a success message
    res
      .status(200)
      .json({ message: "Update product successful !", data: product });
  } catch (err) {
    res.status(500).send({ message: "Internal server error" });
  }
};

// Delete product
const deleteProduct = async (req, res) => {
  try {
    const productCodeDelete = req.body.productCode;
    const deletedProduct = await Product.findOneAndDelete({
      productCode: productCodeDelete,
    });
    if (!deletedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    return res
      .status(200)
      .json({ message: "Product deleted successfully", data: deletedProduct });
  } catch (error) {
    res.status(500).send({ message: "Internal server error" });
  }
};

module.exports = {
  createProduct,
  filterProduct,
  updateProduct,
  deleteProduct,
  findProductByProductCode,
};

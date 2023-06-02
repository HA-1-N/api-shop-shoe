const Product = require("../../model/Product");
const Brand = require("../../model/Brand");
const Color = require("../../model/Color");
const Size = require("../../model/Size");
const Category = require("../../model/Category");
const {
  productValidation,
} = require("../../validators/validatorProduct/validationProduct");

const router = require("express").Router();

// CREATE
const createProduct = async (req, res) => {
  let size = req.body.size;
  if (size && typeof size === "string") {
    size = size.split(",").map(Number);
  }

  const { error } = productValidation({ ...req.body, size });

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
    name: req.body.name,
    size: size,
    color: req.body.color,
    price: req.body.price,
    categories: req.body.categories,
    description: req.body.description,
  });

  // if (req.file) {
  //   newProduct.image = req.file.path;
  // } else {
  //   return res.status(400).send("Image file is required.");
  // }

  if (req.files) {
    let path = "";
    req.files.forEach((file, index, arr) => {
      path = path + file.path + ",";
    });
    path = path.substring(0, path.lastIndexOf(","));
    newProduct.image = path;
  }

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
      const colorArr = product.color;
      const colors = await Color.find({ colorCode: { $in: colorArr } });
      const sizeArr = product.size;
      const sizes = await Size.find({ sizeCode: { $in: sizeArr } });
      const categoryArr = product.categories;
      const categoriesArrObj = await Category.find({
        categoryName: { $in: categoryArr },
      });

      const productInfo = {
        ...product._doc,
        brand: brand,
        colors: colors,
        sizes: sizes,
        categoriesArrObj: categoriesArrObj,
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
    res.status(500).json({ message: "Internal server error", error: error });
  }
};

// find product by id
const findProductByProductCode = async (req, res) => {
  try {
    const productCode = req.params.productCode;
    const product = await Product.findOne({ productCode })
      .populate("brand")
      .exec();

    const brand = await Brand.findOne({ brandCode: product.brandCode });
    const colorArr = product.color;
    const colors = await Color.find({ colorCode: { $in: colorArr } });
    const sizeArr = product.size;
    const sizes = await Size.find({ sizeCode: { $in: sizeArr } });
    const categoryArr = product.categories;
    const categoriesArrObj = await Category.find({
      categoryName: { $in: categoryArr },
    });

    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    const newProduct = {
      ...product._doc,
      brand: brand,
      colors: colors,
      sizes: sizes,
      categoriesArrObj: categoriesArrObj,
    };

    res.status(200).json(newProduct);
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

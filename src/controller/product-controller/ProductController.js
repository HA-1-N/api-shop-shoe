const Product = require("../../model/Product");
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
    res
      .status(200)
      .json({ message: "Create product successfull !", data: savedProduct });
  } catch (error) {
    res.status(500).json(error);
  }
};

// Filter product
const filterProduct = async (req, res) => {
  try {
    // Get the filter criteria from the request body
    const { productCode, brandCode, name } = req.body;
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
      query["brand.code"] = brandCode;
    }
    if (name) {
      query.name = name;
    }

    const pipeline = [
      { $match: query },
      {
        $lookup: {
          from: "brands",
          localField: "brand.code",
          foreignField: "code",
          as: "brand",
        },
      },
      {
        $unwind: "$brand",
      },
      {
        $project: {
          _id: 1,
          name: 1,
          price: 1,
          "brand.name": 1,
        },
      },
      {
        $facet: {
          products: [
            { $skip: (parseInt(page) - 1) * parseInt(limit) },
            { $limit: parseInt(limit) },
          ],
          total: [
            {
              $count: "total",
            },
          ],
        },
      },
    ];

    const results = await Product.aggregate(pipeline);

    // Query the database to find the matching products
    // const products = await Product.find(query)
    //   .skip(startIndex)
    //   .limit(limit)
    //   .exec();

    // const products = await Product.aggregate(pipeline)
    //
    // Calculate the total number of documents matching the filter criteria
    // const count = await Product.countDocuments(query);

    // Return the filtered products
    // Create a response object containing the filtered data and pagination metadata
    const response = {
      products: results[0].products,
      total: results[0].total[0].total,
      page: parseInt(page),
      limit: parseInt(limit),
    };

    res.status(200).json(response);
  } catch (err) {
    // Return an error response if there was an error
    res.status(500).json({ error: "Internal server error" });
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
};
const Category = require("../../model/Category");
const {
  categoryValidation,
} = require("../../validators/validationCategory/validationCategory");

const createCategory = async (req, res) => {
  const { error } = categoryValidation(req.body);

  if (error) {
    return res.status(400).send(error.details[0].message);
  }

  const nameCategoryExist = await Category.findOne({
    categoryName: req.body.categoryName,
  });

  if (nameCategoryExist) {
    return res.status(400).send("CategoryName of Category is already");
  }

  const newCategory = new Category(req.body);
  try {
    const savedCategory = await newCategory.save();
    res
      .status(200)
      .json({ message: "Create Category successful !", data: savedCategory });
  } catch (error) {
    res.status(500).json({ error: error, message: "Internal server error" });
  }
};

// filter category
const filterCategory = async (req, res) => {
  try {
    const { categoryName } = req.body;
    // Extract pagination parameters from the request query string
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;

    // Build the MongoDB query object based on the filter criteria
    const query = {};

    if (categoryName) {
      query.categoryName = categoryName;
    }

    // Query the database for the filtered data
    const data = await Category.find(query)
      .skip(startIndex)
      .limit(limit)
      .exec();

    const count = await Category.countDocuments(query);

    const response = {
      data,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(count / limit),
        totalItems: count,
      },
    };

    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

// Update category
const updateCategory = async (req, res) => {
  const { error } = categoryValidation(req.body);

  if (error) {
    return res.status(400).send({ message: error.details[0].message });
  }

  try {
    const newCategory = await Category.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      { new: true }
    );

    if (!newCategory) {
      return res.status(404).send({ message: "Category not found" });
    }

    return res
      .status(200)
      .json({ message: "Update category successful !", data: newCategory });
  } catch (error) {
    return res
      .status(500)
      .json({ error: error, message: "Internal error server" });
  }
};

// Delete category
const deleteCategory = async (req, res) => {
  try {
    const { categoryName } = req.body;
    const deleteCategory = await Category.findOneAndDelete({
      categoryName: categoryName,
    });
    if (!deleteCategory) {
      return res.status(404).json({ message: "Category not found" });
    }
    return res
      .status(200)
      .json({ message: "Delete category successfull", data: deleteCategory });
  } catch (error) {
    return res.status(500).json({ message: "Internal error server" });
  }
};

// get category by name
const getCategoryByName = async (req, res) => {
  try {
    const { categoryName } = req.body;
    const category = await Category.findOne({
      categoryName: categoryName,
    });
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }
    return res.status(200).json({ message: "Ssuccessfull", data: category });
  } catch (error) {
    return res.status(500).json({ message: "Internal error server" });
  }
};

module.exports = {
  createCategory,
  filterCategory,
  updateCategory,
  deleteCategory,
  getCategoryByName,
};

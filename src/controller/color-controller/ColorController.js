const Color = require("../../model/Color");
const {
  colorValidation,
} = require("../../validators/validationColor/validationColor");

//createColor
const createColor = async (req, res) => {
  const { error } = colorValidation(req.body);

  if (error) {
    return res.status(400).send(error.details[0].message);
  }

  const colorCodeExist = await Color.findOne({
    colorCode: req.body.colorCode,
  });

  if (colorCodeExist) {
    return res.status(400).send("colorCode is already");
  }

  const nameColorExist = await Color.findOne({
    colorName: req.body.colorName,
  });

  if (nameColorExist) {
    return res.status(400).send("colorName of Color is already");
  }

  const newColor = new Color(req.body);
  try {
    const savedColor = await newColor.save();
    res
      .status(200)
      .json({ message: "Create Color successful !", data: savedColor });
  } catch (error) {
    res.status(500).json({ error: error, message: "Internal server error" });
  }
};

// filter color
const filterColor = async (req, res) => {
  try {
    const { colorCode, colorName } = req.body;
    // Extract pagination parameters from the request query string
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;

    // Build the MongoDB query object based on the filter criteria
    const query = {};
    if (colorCode && colorCode.trim().length > 0) {
      query.colorCode = {
        $regex: ".*" + colorCode.trim() + ".*",
        $options: "i",
      };
    }
    if (colorName && colorName.trim().length > 0) {
      query.colorName = {
        $regex: ".*" + colorName.trim() + ".*",
        $options: "i",
      };
    }

    // Query the database for the filtered data
    const data = await Color.find(query).skip(startIndex).limit(limit).exec();

    const count = await Color.countDocuments(query);

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

// UPDATE
const updateColor = async (req, res) => {
  const { error } = colorValidation(req.body);

  if (error) {
    return res.status(400).send({ message: error.details[0].message });
  }

  try {
    const updateColor = await Color.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    if (!updateColor) {
      return res.status(404).send({ message: "Color not found" });
    }
    return res
      .status(200)
      .json({ message: "Update color successful !", data: updateColor });
  } catch (error) {
    return res.status(500).json(error);
  }
};

// Delete
const deleteColor = async (req, res) => {
  try {
    const colorCodeDelete = req.body.colorCode;
    const deletedColor = await Color.findOneAndDelete({
      colorCode: colorCodeDelete,
    });
    if (!deletedColor) {
      return res.status(404).json({ message: "Color not found" });
    }

    return res
      .status(200)
      .json({ message: "Color deleted successful", data: deletedColor });
  } catch (error) {
    return res.status(500).send({ message: "Internal server error" });
  }
};

const getColorByCode = async (req, res) => {
  try {
    const colorCode = req.body.colorCode;
    const color = await Color.findOne({
      colorCode: colorCode,
    });
    if (!color) {
      return res.status(404).json({ message: "Color not found" });
    }

    return res
      .status(200)
      .json({ message: "Get color by code successful", data: color });
  } catch (error) {
    return res.status(500).send({ message: "Internal server error" });
  }
};

module.exports = {
  createColor,
  filterColor,
  updateColor,
  deleteColor,
  getColorByCode,
};

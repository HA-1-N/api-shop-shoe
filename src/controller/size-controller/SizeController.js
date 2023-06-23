const Size = require("../../model/Size");
const {
  sizeValidation,
} = require("../../validators/validationSize/validationSize");

// Create size
const createSize = async (req, res) => {
  const { error } = sizeValidation(req.body);

  if (error) {
    return res.status(400).send(error.details[0].message);
  }

  const sizeCodeExist = await Size.findOne({
    sizeCode: req.body.sizeCode,
  });

  if (sizeCodeExist) {
    return res.status(400).send("sizeCode is already");
  }

  const nameSizeExist = await Size.findOne({
    sizeName: req.body.sizeName,
  });

  if (nameSizeExist) {
    return res.status(400).send("sizeName of Size is already");
  }
  const newSize = new Size(req.body);
  try {
    const savedSize = await newSize.save();
    return res
      .status(200)
      .json({ message: "Create Size successful !", data: savedSize });
  } catch (error) {
    return res
      .status(500)
      .json({ error: error, message: "Internal server error" });
  }
};

// filter size
const filterSize = async (req, res) => {
  try {
    const { sizeCode, sizeName } = req.body;
    // Extract pagination parameters from the request query string
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;

    // Build the MongoDB query object based on the filter criteria
    const query = {};
    if (sizeCode) {
      query.sizeCode = sizeCode;
    }
    if (sizeName) {
      query.sizeName = sizeName;
    }

    // Query the database for the filtered data
    const data = await Size.find(query).skip(startIndex).limit(limit).exec();

    const count = await Size.countDocuments(query);

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
    return res.status(500).json({ message: "Internal server error" });
  }
};

// Update size
const updateSize = async (req, res) => {
  const { error } = sizeValidation(req.body);

  if (error) {
    return res.status(400).send({ message: error.details[0].message });
  }

  try {
    const updateSizeDetail = await Size.findOneAndUpdate(
      { sizeCode: req.params.sizeCode },
      {
        $set: req.body,
      },
      { new: true }
    );

    if (!updateSizeDetail) {
      return res.status(404).send({ message: "Size not found" });
    }
    return res
      .status(200)
      .json({ message: "Update size successful !", data: updateSizeDetail });
  } catch (error) {
    return res.status(500).json(error);
  }
};

// Delete size
const deleteSize = async (req, res) => {
  try {
    const { sizeCode } = req.body;
    const deleteSize = await Size.findOneAndDelete({
      sizeCode: sizeCode,
    });
    if (!deleteSize) {
      return res.status(404).json({ message: "Size not found" });
    }
    return res
      .status(200)
      .json({ message: "Delete size successfull", data: deleteSize });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal error server" });
  }
};

// Get size by code
const getSizeByCode = async (req, res) => {
  try {
    const { sizeCode } = req.body;
    const size = await Size.findOne({
      sizeCode: sizeCode,
    });
    if (!size) {
      return res.status(404).json({ message: "Size not found" });
    }
    return res
      .status(200)
      .json({ message: "Get size by code successfull", data: size });
  } catch (error) {
    return res.status(500).json({ message: "Internal error server" });
  }
};

module.exports = {
  createSize,
  filterSize,
  updateSize,
  deleteSize,
  getSizeByCode,
};

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
    return res.status(400).send("nameSize of Size is already");
  }
  const newSize = new Size(req.body);
  try {
    const savedSize = await newSize.save();
    res
      .status(200)
      .json({ message: "Create Size successful !", data: savedSize });
  } catch (error) {
    res.status(500).json({ error: error, message: "Internal server error" });
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

    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = { createSize, filterSize };

const Voucher = require("../../model/Voucher");
const {
  voucherValidation,
} = require("../../validators/validationVoucher/validationVoucher");

const router = require("express").Router();

// CREATE
const createVoucher = async (req, res) => {
  const { error } = voucherValidation(req.body);

  if (error) {
    return res.status(400).send(error.details[0].message);
  }

  const voucherCodeExist = await Voucher.findOne({
    voucherCode: req.body.voucherCode,
  });

  if (voucherCodeExist) {
    return res.status(400).json({ message: "voucherCode is already" });
  }

  const newVoucher = new Voucher(req.body);

  try {
    const savedVoucher = await newVoucher.save();
    res
      .status(200)
      .json({ message: "Create voucher successful !", data: savedVoucher });
  } catch (error) {
    res.status(500).json(error);
  }
};

// Filter
const filterVoucher = async (req, res) => {
  try {
    const { voucherCode } = req.body;
    // Extract pagination parameters from the request query string
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;

    // Build the MongoDB query object based on the filter criteria
    const query = {};
    if (voucherCode) {
      query.voucherCode = voucherCode;
    }

    // Query the database for the filtered data
    const data = await Voucher.find(query).skip(startIndex).limit(limit).exec();

    const count = await Voucher.countDocuments(query);

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
    res.status(500).json({ error: "Internal server error" });
  }
};

// UPDATE
const updateVoucher = async (req, res) => {
  const { error } = voucherValidation(req.body);

  if (error) {
    return res.status(400).send({ message: error.details[0].message });
  }

  try {
    const updateVoucher = await Voucher.findOneAndUpdate(
      { voucherCode: req.params.voucherCode },
      {
        $set: req.body,
      },
      { new: true }
    );

    if (!updateVoucher) {
      return res.status(404).send({ message: "Voucher not found" });
    }
    res
      .status(200)
      .json({ message: "Update Voucher successful !", data: updateVoucher });
  } catch (error) {
    res.status(500).json(error);
  }
};

// Delete
const deleteVoucher = async (req, res) => {
  try {
    const voucherCodeDelete = req.body.voucherCode;
    const deletedVoucher = await Voucher.findOneAndDelete({
      voucherCode: voucherCodeDelete,
    });
    if (!deletedVoucher) {
      return res.status(404).json({ message: "Voucher not found" });
    }

    return res
      .status(200)
      .json({ message: "Voucher deleted successfully", data: deletedVoucher });
  } catch (error) {
    res.status(500).send({ message: "Internal server error" });
  }
};

// Get voucher by code
const getVoucherByCode = async (req, res) => {
  try {
    const { voucherCode } = req.body;
    const voucher = await Voucher.findOne({
      voucherCode: voucherCode,
    });
    if (!voucher) {
      return res.status(404).json({ message: "Voucher not found" });
    }
    return res
      .status(200)
      .json({ message: "Get voucher by code successfull", data: voucher });
  } catch (error) {
    return res.status(500).json({ message: "Internal error server" });
  }
};

module.exports = {
  createVoucher,
  filterVoucher,
  updateVoucher,
  deleteVoucher,
  getVoucherByCode,
};

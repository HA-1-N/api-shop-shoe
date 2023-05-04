const Voucher = require("../../model/Voucher");

const router = require("express").Router();

// CREATE
const createVoucher = async (req, res) => {
  const newVoucher = new Voucher(req.body);

  try {
    const savedVoucher = await newVoucher.save();
    res.status(200).json(savedVoucher);
  } catch (error) {
    res.status(500).json(error);
  }
};

module.exports = {
  createVoucher,
};

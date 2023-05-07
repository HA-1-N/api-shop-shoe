const { json } = require("express");
const express = require("express");
const {
  registerUser,
  login,
  forgotPassword,
  resetPassword,
} = require("../../controller/user-controller/AuthController");

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", login);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:userId/:token", resetPassword);

module.exports = router;

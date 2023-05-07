const router = require("express").Router();
const User = require("../../model/User");
const CryptoJS = require("crypto-js");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const { sendEmail } = require("../../util/sendEmail");
const {
  registerValidation,
  loginValidation,
} = require("../../validators/validationAuth/validationAuth");
const Joi = require("joi");
const Token = require("../../model/Token");

// Register
const registerUser = async (req, res) => {
  // Lets validate the data before we a user
  const { error } = registerValidation(req.body);

  if (error) {
    return res.status(400).send(error.details[0].message);
  }

  // Checking if userName is already in the database
  const userNameExist = await User.findOne({
    userName: req.body.userName,
  });

  if (userNameExist) {
    return res.status(400).send("userName is already");
  }

  // Checking if email is already in the database
  const emailExist = await User.findOne({
    email: req.body.email,
  });

  if (emailExist) {
    return res.status(400).send("Email is already");
  }

  const newUser = new User({
    userName: req.body.userName,
    email: req.body.email,
    password: CryptoJS.AES.encrypt(req.body.password, process.env.PASS_SEC),
    rePassword: CryptoJS.AES.encrypt(req.body.rePassword, process.env.PASS_SEC),
    phone: req.body.phone,
    isAdmin: req.body.isAdmin,
  });

  try {
    const savedUser = await newUser.save();
    res.status(201).json(savedUser);
  } catch (error) {
    res.status(500).json(error);
  }
};

// login
const login = async (req, res) => {
  const { error } = loginValidation(req.body);

  if (error) {
    return res.status(400).send(error.details[0].message);
  }

  try {
    const user = await User.findOne({ userName: req.body.userName });

    !user && res.status(401).json("User is not found !");

    const hashedPassword = CryptoJS.AES.decrypt(
      user.password,
      process.env.PASS_SEC
    );

    const Originalpassword = hashedPassword.toString(CryptoJS.enc.Utf8);

    Originalpassword !== req.body.password &&
      res.status(401).json("Wrong credentials !");

    const accessToken = jwt.sign(
      {
        id: user._id,
        isAdmin: user.isAdmin,
      },
      process.env.JWT_SEC,
      { expiresIn: "3d" }
    );

    const { password, ...others } = user._doc; // Lưu password trong file _doc(document)

    res.status(200).json({ ...others, accessToken });
  } catch (error) {
    res.status(500).json(error);
  }
};

// Forgot password
const forgotPassword = async (req, res) => {
  const schema = Joi.object({ email: Joi.string().email().required() });
  const { error } = schema.validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      res.status(401).json({ message: "User is not found !" });
    }
    let token = await Token.findOne({ userId: user._id });

    if (!token) {
      token = await new Token({
        userId: user._id,
        token: crypto.randomBytes(32).toString("hex"),
      }).save();
    }
    const link = `localhost:5000/api/auth/password-reset/${user._id}/${token.token}`;
    await sendEmail(user.email, "Password reset", link);

    res.send("password reset link sent to your email account");
  } catch (error) {
    res.send("An error occured");
    console.log(error);
  }
};

const resetPassword = async (req, res) => {
  try {
    const schema = Joi.object({ password: Joi.string().required() });
    const { error } = schema.validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const user = await User.findById(req.params.userId);
    if (!user) return res.status(400).send("invalid link or expired");

    const token = await Token.findOne({
      userId: user._id,
      token: req.params.token,
    });
    if (!token) return res.status(400).send("Invalid link or expired");

    user.password = req.body.password;
    await user.save();
    await token.delete();

    res.send("password reset sucessfully.");
  } catch (error) {
    res.send("An error occured");
    console.log(error);
  }
};

module.exports = {
  registerUser,
  login,
  forgotPassword,
  resetPassword,
};

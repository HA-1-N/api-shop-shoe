const User = require("../../model/User");
const {
  userValidation,
} = require("../../validators/validationUser/validationUser");
const CryptoJS = require("crypto-js");

// Filter
const filterUser = async (req, res) => {
  try {
    const { userName, email } = req.body;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;

    const query = {};
    if (userName) {
      query.userName = userName;
    }
    if (email) {
      query.email = email;
    }

    const data = await User.find(query).skip(startIndex).limit(limit).exec();

    const count = await User.countDocuments(query);

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
const updateUser = async (req, res) => {
  // const { error } = userValidation(req.body);
  // if (error) {
  //   return res.status(400).send({ message: error.details[0].message });
  // }
  // if (req.body.password) {
  //   req.body.password = CryptoJS.AES.encrypt(
  //     req.body.password,
  //     process.env.PASS_SEC
  //   ).toString();
  // }
  // try {
  //   const updateUser = await User.findByIdAndUpdate(
  //     req.params.id,
  //     {
  //       $set: req.body,
  //     },
  //     { new: true }
  //   );
  //   if (!updateUser) {
  //     return res.status(404).send({ message: "User not found" });
  //   }
  //   res
  //     .status(200)
  //     .json({ message: "Update user successful !", data: updateUser });
  // } catch (error) {
  //   res.status(500).json(error);
  // }

  // C2
  const { error } = userValidation(req.body);
  if (error) {
    return res.status(400).send({ message: error.details[0].message });
  }
  const { id } = req.params;
  const { oldPassword, newPassword, ...updateData } = req.body;
  try {
    // Find the user by ID
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).send({ message: "User not found" });
    }
    // Verify the old password
    const isPasswordCorrect =
      CryptoJS.AES.decrypt(user.password, process.env.PASS_SEC).toString(
        CryptoJS.enc.Utf8
      ) === oldPassword;
    if (!isPasswordCorrect) {
      return res.status(400).send({ message: "Invalid old password" });
    }
    // Encrypt and update the new password if provided
    if (req.body.password) {
      const encryptedPassword = CryptoJS.AES.encrypt(
        req.body.password,
        process.env.PASS_SEC
      ).toString();
      updateData.password = encryptedPassword;
    }

    if (req.body.rePassword) {
      const encryptedRePassword = CryptoJS.AES.encrypt(
        req.body.rePassword,
        process.env.PASS_SEC
      ).toString();
      updateData.rePassword = encryptedRePassword;
    }
    // Update the user data
    const updatedUser = await User.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true }
    );
    res
      .status(200)
      .json({ message: "Update user successful!", data: updatedUser });
  } catch (error) {
    res.status(500).json(error);
  }
};

// get current user
const getCurrentUser = async (req, res) => {
  try {
    const currentUser = await User.findById(req.params.id);
    res.status(200).json({ user: currentUser });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: "Server Error" });
  }
};

module.exports = {
  filterUser,
  updateUser,
  getCurrentUser,
};

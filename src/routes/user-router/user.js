const { json } = require("express");
const express = require("express");
const {
  filterUser,
  updateUser,
} = require("../../controller/user-controller/UserController");
const {
  verifyToken,
  verifyTokenAndAdmin,
} = require("../../middlewares/auth/authorization");

const router = express.Router();

router.post("/filter", verifyTokenAndAdmin, filterUser);
router.post("/update", verifyTokenAndAdmin, updateUser);

module.exports = router;

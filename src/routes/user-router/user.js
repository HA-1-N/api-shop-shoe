const { json } = require("express");
const express = require("express");
const {
  filterUser,
  updateUser,
  getCurrentUser,
} = require("../../controller/user-controller/UserController");
const {
  verifyToken,
  verifyTokenAndAdmin,
} = require("../../middlewares/auth/authorization");

const router = express.Router();

router.get("/current-user/:id", getCurrentUser);
router.post("/filter", verifyTokenAndAdmin, filterUser);
router.post("/update/:id", verifyTokenAndAdmin, updateUser);

module.exports = router;

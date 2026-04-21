const express = require("express");
const router = express.Router();

const fileMiddleware = require("../middleware/file");
const { auth } = require("../middleware/auth");
const {
  register,
  login,
  current,
  edit,
  getDrivers,
  changePassword,
} = require("../controllers/users");
const { admin } = require("../middleware/admin");

router.post("/register", fileMiddleware.single("image"), register);
router.post("/login", fileMiddleware.single("image"), login);
router.get("/", auth, current);
router.get("/drivers", auth, admin, getDrivers);
router.put("/", auth, edit);
router.put("/change-password", auth, changePassword);

module.exports = router;

const express = require("express");
const router = express.Router();

const fileMiddleware = require("../middleware/file");
const { auth } = require("../middleware/auth");
const {
  createDriver,
  removeDriver,
  editDriver,
  getMyCars,
} = require("../controllers/drivers");
const { admin } = require("../middleware/admin");

router.post("/", auth, admin, createDriver);
router.put("/:id", auth, admin, editDriver);
router.delete("/:id", auth, admin, removeDriver);
router.get("/cars", auth, getMyCars);

module.exports = router;

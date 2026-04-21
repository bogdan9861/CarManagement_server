const express = require("express");
const router = express.Router();

const fileMiddleware = require("../middleware/file");
const { auth } = require("../middleware/auth");
const {
  createCar,
  editCar,
  removeCar,
  getCars,
  chenageCarStatus,
} = require("../controllers/cars");
const { admin } = require("../middleware/admin");

router.post("/", auth, admin, fileMiddleware.single("image"), createCar);
router.put("/:id", auth, admin, fileMiddleware.single("image"), editCar);
router.get("/", auth, getCars);
router.delete("/:id", admin, auth, removeCar);
router.put("/change-status/:id", auth, chenageCarStatus);

module.exports = router;

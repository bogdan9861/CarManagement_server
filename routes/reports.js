const express = require("express");
const router = express.Router();

const fileMiddleware = require("../middleware/file");
const { auth } = require("../middleware/auth");
const {
  createReport,
  editReport,
  getReports,
  removeReport,
  getMyReports,
} = require("../controllers/reports");

router.post("/", auth, fileMiddleware.single("file"), createReport);
router.put("/:id", auth, fileMiddleware.single("file"), editReport);
router.get("/", auth, getReports);
router.delete("/:id", auth, removeReport);
router.get("/my", auth, getMyReports);

module.exports = router;

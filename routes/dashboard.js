const express = require("express");
const router = express.Router();

const fileMiddleware = require("../middleware/file");
const { auth } = require("../middleware/auth");
const { getDashboard } = require("../controllers/dashboard");
const { admin } = require("../middleware/admin");

router.get("/", auth, admin, getDashboard);

module.exports = router;

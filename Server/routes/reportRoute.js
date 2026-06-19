const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const roleMiddleware = require("../middleware/roleMiddleware");
const { reportProperty, getReports } = require("../controllers/reportController");

// أي يوزر مسجل دخول يقدر يعمل report
router.post("/:propertyId", auth, reportProperty);

// admin بس يشوف الـ reports
router.get("/", auth, roleMiddleware("admin"), getReports);

module.exports = router;
const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const roleMiddleware = require("../middleware/roleMiddleware");
const { reportProperty, getReports } = require("../controllers/reportController");

router.post("/:propertyId", auth, reportProperty);

router.get("/", auth, roleMiddleware("admin"), getReports);

module.exports = router;
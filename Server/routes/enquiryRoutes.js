const express = require("express");
const router = express.Router();

const {
  sendEnquiry,
  ownerEnquiries,
  seekerEnquiries,
} = require("../controllers/enquiryController");

const protect = require("../middleware/auth");

router.post("/:propertyId", protect, sendEnquiry);

router.get("/owner", protect, ownerEnquiries);

router.get("/seeker", protect, seekerEnquiries);

module.exports = router;

const express = require("express");
const router = express.Router();

const {
    sendEnquiry,
    ownerEnquiries,
    seekerEnquiries
} = require("../controllers/EnquiryController");

const auth = require("../middleware/auth");

router.post("/:propertyId",auth,sendEnquiry);

router.get("/owner",auth,ownerEnquiries);

router.get("/seeker",auth,seekerEnquiries);

module.exports = router;

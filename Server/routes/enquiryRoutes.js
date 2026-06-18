const express = require("express");
const router = express.Router();

const {
<<<<<<< HEAD
  sendEnquiry,
  ownerEnquiries,
  seekerEnquiries,
} = require("../controllers/enquiryController");

const protect = require("../middleware/auth");

router.post("/:propertyId", protect, sendEnquiry);

router.get("/owner", protect, ownerEnquiries);

router.get("/seeker", protect, seekerEnquiries);
=======
    sendEnquiry,
    ownerEnquiries,
    seekerEnquiries
} = require("../controllers/EnquiryController");

const auth = require("../middleware/auth");

router.post("/:propertyId",auth,sendEnquiry);

router.get("/owner",auth,ownerEnquiries);

router.get("/seeker",auth,seekerEnquiries);
>>>>>>> 6a735498c3f3b39d329445285c2f12b5a74b380a

module.exports = router;

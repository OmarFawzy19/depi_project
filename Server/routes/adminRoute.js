const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const roleMiddleware = require("../middleware/roleMiddleware");
const {
  getPendingProperties,
  approveProperty,
  rejectProperty,
  banUser,
} = require("../controllers/adminController");

// كل الـ routes دي محتاجة login + admin role
router.use(auth, roleMiddleware("admin"));

router.get("/properties/pending", getPendingProperties);
router.put("/properties/:id/approve", approveProperty);
router.put("/properties/:id/reject", rejectProperty);
router.put("/users/:id/ban", banUser);

module.exports = router;
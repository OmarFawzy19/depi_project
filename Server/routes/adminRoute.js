const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const roleMiddleware = require("../middleware/roleMiddleware");

const {
  getPendingProperties,
  approveProperty,
  rejectProperty,
  getUsersWithPropertiesCount,
  pauseUser,
  activateUser,
  removeUser,
} = require("../controllers/adminController");

// كل الـ routes دي محتاجة login + admin role
router.use(auth, roleMiddleware("admin"));

router.get("/properties/pending", getPendingProperties);
router.put("/properties/:id/approve", approveProperty);
router.put("/properties/:id/reject", rejectProperty);

// Admin users management
router.get("/users", getUsersWithPropertiesCount);
router.put("/users/:id/pause", pauseUser);
router.put("/users/:id/activate", activateUser);
router.delete("/users/:id", removeUser);

module.exports = router;

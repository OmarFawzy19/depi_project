const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");

const {
  getProfile,
  updateProfile,
  changePassword,
  deactivateAccount,
  activateAccount,
  deleteAccount,
} = require("../controllers/userController");

// All routes require authentication
router.get("/profile", auth, getProfile);
router.put("/profile", auth, updateProfile);
router.put("/change-password", auth, changePassword);
router.put("/deactivate", auth, deactivateAccount);
router.put("/activate", auth, activateAccount);
router.delete("/delete", auth, deleteAccount);

module.exports = router;

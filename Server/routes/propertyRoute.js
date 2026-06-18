const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const Property = require("../models/Property");

const {
  getProperties,
  getMyProperties,
  getNearbyProperties,
  getPropertyById,
  createProperty,
  updateProperty,
  deleteProperty,
  togglePauseProperty,
} = require("../controllers/propertyController");

// Public routes
router.get("/", getProperties);

router.get("/nearby", getNearbyProperties);

// Protected route: get current owner's properties only
router.get("/my/listings", auth, getMyProperties);

// Temporary test route: get all properties including pending
router.get("/all", async (req, res) => {
  try {
    const properties = await Property.find()
      .populate("owner", "name email")
      .sort({ createdAt: -1 });

    res.json(properties);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/:id", getPropertyById);

// Protected routes
router.post("/", auth, createProperty);

router.put("/:id", auth, updateProperty);

router.delete("/:id", auth, deleteProperty);

router.patch("/:id/pause", auth, togglePauseProperty);

module.exports = router;

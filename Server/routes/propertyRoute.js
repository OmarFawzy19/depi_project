const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");

const {
  getProperties,
  getNearbyProperties,
  getPropertyById,
  createProperty,
} = require("../controllers/propertyController");

// ── Public routes (no login required) ──
router.get("/", getProperties);           // GET /api/properties?type=villa&minPrice=1000
router.get("/nearby", getNearbyProperties); // GET /api/properties/nearby?lat=30&lng=31&radius=10
router.get("/:id", getPropertyById);       // GET /api/properties/abc123

// ── Protected routes (login required) ──
router.post("/", auth, createProperty);    // POST /api/properties

module.exports = router;

const Property = require("../models/Property");

// ──────────────────────────────────────────
// GET /api/properties
// List properties with optional filters
// ──────────────────────────────────────────
exports.getProperties = async (req, res) => {
  try {
    // Build a dynamic filter object from query params
    const filter = { status: "approved" }; // only show approved properties

    // Filter by type (e.g. ?type=villa)
    if (req.query.type) {
      filter.type = req.query.type;
    }

    // Filter by price range (e.g. ?minPrice=1000&maxPrice=5000)
    if (req.query.minPrice || req.query.maxPrice) {
      filter.price = {};
      if (req.query.minPrice) filter.price.$gte = Number(req.query.minPrice);
      if (req.query.maxPrice) filter.price.$lte = Number(req.query.maxPrice);
    }

    // Filter by minimum bedrooms (e.g. ?bedrooms=3)
    if (req.query.bedrooms) {
      filter.bedrooms = { $gte: Number(req.query.bedrooms) };
    }

    // Filter by priceType (e.g. ?priceType=rent)
    if (req.query.priceType && req.query.priceType !== "all") {
      filter.priceType = req.query.priceType;
    }

    // Text search in title or location (e.g. ?query=zamalek)
    if (req.query.query) {
      const regex = new RegExp(req.query.query, "i"); // case-insensitive
      filter.$or = [{ title: regex }, { location: regex }];
    }

    const properties = await Property.find(filter)
      .populate("owner", "name email") // include owner name & email
      .sort({ createdAt: -1 }); // newest first

    res.json(properties);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ──────────────────────────────────────────
// GET /api/properties/nearby
// Find properties within a radius (in km)
// Query: ?lat=30.04&lng=31.23&radius=10
// ──────────────────────────────────────────
exports.getNearbyProperties = async (req, res) => {
  try {
    const { lat, lng, radius } = req.query;

    if (!lat || !lng || !radius) {
      return res.status(400).json({
        error: "lat, lng, and radius are required",
      });
    }

    const userLat = Number(lat);
    const userLng = Number(lng);
    const radiusKm = Number(radius);

    // Get all approved properties and filter by distance in JS
    // (For production you'd use MongoDB's $geoNear with a 2dsphere index)
    const all = await Property.find({ status: "approved" }).populate(
      "owner",
      "name email"
    );

    const nearby = all.filter((p) => {
      const dist = haversineKm(userLat, userLng, p.latitude, p.longitude);
      return dist <= radiusKm;
    });

    // Attach distance to each result and sort by closest
    const withDistance = nearby
      .map((p) => ({
        ...p.toObject(),
        distance: Math.round(
          haversineKm(userLat, userLng, p.latitude, p.longitude) * 10
        ) / 10, // round to 1 decimal
      }))
      .sort((a, b) => a.distance - b.distance);

    res.json(withDistance);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ──────────────────────────────────────────
// GET /api/properties/:id
// Get a single property by its ID
// ──────────────────────────────────────────
exports.getPropertyById = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id).populate(
      "owner",
      "name email"
    );

    if (!property) {
      return res.status(404).json({ error: "Property not found" });
    }

    res.json(property);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ──────────────────────────────────────────
// POST /api/properties
// Create a new property (owner only)
// ──────────────────────────────────────────
exports.createProperty = async (req, res) => {
  try {
    const property = await Property.create({
      ...req.body,
      owner: req.user.id, // comes from auth middleware (JWT)
      status: "pending", // always starts as pending
    });

    res.status(201).json(property);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ──────────────────────────────────────────
// Haversine formula — distance between two
// lat/lng points in kilometers
// ──────────────────────────────────────────
function haversineKm(lat1, lng1, lat2, lng2) {
  const R = 6371; // Earth's radius in km
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(a));
}

function toRad(deg) {
  return (deg * Math.PI) / 180;
}

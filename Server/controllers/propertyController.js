const Property = require("../models/Property");

// ──────────────────────────────────────────
// GET /api/properties
// List approved properties only
// ──────────────────────────────────────────
exports.getProperties = async (req, res) => {
  try {
    const filter = {};

    if (req.query.type) {
      filter.type = req.query.type;
    }

    if (req.query.minPrice || req.query.maxPrice) {
      filter.price = {};
      if (req.query.minPrice) filter.price.$gte = Number(req.query.minPrice);
      if (req.query.maxPrice) filter.price.$lte = Number(req.query.maxPrice);
    }

    if (req.query.bedrooms) {
      filter.bedrooms = { $gte: Number(req.query.bedrooms) };
    }

    if (req.query.priceType && req.query.priceType !== "all") {
      filter.priceType = req.query.priceType;
    }

    if (req.query.query) {
      const regex = new RegExp(req.query.query, "i");
      filter.$or = [{ title: regex }, { location: regex }];
    }

    const properties = await Property.find(filter)
      .populate("owner", "name email")
      .sort({ createdAt: -1 });

    res.json(properties);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ──────────────────────────────────────────
// GET /api/properties/nearby
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

    const all = await Property.find({ status: "approved" }).populate(
      "owner",
      "name email",
    );

    const nearby = all.filter((p) => {
      const dist = haversineKm(userLat, userLng, p.latitude, p.longitude);
      return dist <= radiusKm;
    });

    const withDistance = nearby
      .map((p) => ({
        ...p.toObject(),
        distance:
          Math.round(
            haversineKm(userLat, userLng, p.latitude, p.longitude) * 10,
          ) / 10,
      }))
      .sort((a, b) => a.distance - b.distance);

    res.json(withDistance);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ──────────────────────────────────────────
// GET /api/properties/:id
// ──────────────────────────────────────────
exports.getPropertyById = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id).populate(
      "owner",
      "name email",
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
// GET /api/properties/my/listings
// Get current owner's properties only
// ──────────────────────────────────────────
exports.getMyProperties = async (req, res) => {
  try {
    const properties = await Property.find({ owner: req.user.id })
      .populate("owner", "name email")
      .sort({ createdAt: -1 });

    res.json(properties);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ──────────────────────────────────────────
// POST /api/properties
// ──────────────────────────────────────────
exports.createProperty = async (req, res) => {
  try {
    const property = await Property.create({
      ...req.body,
      owner: req.user.id,
      status: "pending",
    });

    res.status(201).json(property);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ──────────────────────────────────────────
// PUT /api/properties/:id
// Update a property
// Property must be paused before editing
// After editing, status becomes pending again
// ──────────────────────────────────────────
exports.updateProperty = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);

    if (!property) {
      return res.status(404).json({ error: "Property not found" });
    }

    if (property.owner.toString() !== req.user.id) {
      return res
        .status(403)
        .json({ error: "Not allowed to update this property" });
    }

    if (property.status !== "paused") {
      return res.status(400).json({
        error: "You must pause this property before editing it",
      });
    }

    const allowedUpdates = [
      "title",
      "description",
      "price",
      "priceType",
      "type",
      "bedrooms",
      "bathrooms",
      "area",
      "location",
      "latitude",
      "longitude",
      "images",
      "features",
    ];

    allowedUpdates.forEach((field) => {
      if (req.body[field] !== undefined) {
        property[field] = req.body[field];
      }
    });

    property.status = "pending";

    const updatedProperty = await property.save();

    await updatedProperty.populate("owner", "name email");

    res.json(updatedProperty);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ──────────────────────────────────────────
// DELETE /api/properties/:id
// Delete a property
// ──────────────────────────────────────────
exports.deleteProperty = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);

    if (!property) {
      return res.status(404).json({ error: "Property not found" });
    }

    if (property.owner.toString() !== req.user.id) {
      return res.status(403).json({
        error: "Not allowed to delete this property",
      });
    }

    await Property.findByIdAndDelete(req.params.id);

    res.json({
      message: "Property deleted successfully",
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ──────────────────────────────────────────
// PATCH /api/properties/:id/pause
// Pause / unpause a property
// ──────────────────────────────────────────
exports.togglePauseProperty = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);

    if (!property) {
      return res.status(404).json({ error: "Property not found" });
    }

    if (property.owner.toString() !== req.user.id) {
      return res.status(403).json({
        error: "Not allowed to pause this property",
      });
    }

    property.status = property.status === "paused" ? "approved" : "paused";

    const updatedProperty = await property.save();

    await updatedProperty.populate("owner", "name email");

    res.json(updatedProperty);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ──────────────────────────────────────────
// Haversine formula
// ──────────────────────────────────────────
function haversineKm(lat1, lng1, lat2, lng2) {
  const R = 6371;
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

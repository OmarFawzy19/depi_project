const Property = require("../models/Property");
const User = require("../models/User");

// GET /api/admin/properties/pending
exports.getPendingProperties = async (req, res) => {
  try {
    const properties = await Property.find({ status: "pending" })
      .populate("owner", "name email")
      .sort({ createdAt: -1 });

    res.json(properties);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// PUT /api/admin/properties/:id/approve
exports.approveProperty = async (req, res) => {
  try {
    const property = await Property.findByIdAndUpdate(
      req.params.id,
      { status: "approved" },
      { new: true },
    ).populate("owner", "name email");

    if (!property) {
      return res.status(404).json({ error: "Property not found" });
    }

    res.json({
      message: "Property approved successfully",
      property,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// PUT /api/admin/properties/:id/reject
exports.rejectProperty = async (req, res) => {
  try {
    const { reason } = req.body;

    if (!reason || reason.trim() === "") {
      return res.status(400).json({
        error: "Rejection reason is required",
      });
    }

    const property = await Property.findByIdAndUpdate(
      req.params.id,
      {
        status: "rejected",
        rejectionReason: reason.trim(),
      },
      { new: true },
    ).populate("owner", "name email");

    if (!property) {
      return res.status(404).json({ error: "Property not found" });
    }

    res.json({
      message: "Property rejected successfully",
      property,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// PUT /api/admin/users/:id/ban
exports.banUser = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { banned: true },
      { new: true },
    );

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({
      message: "User banned",
      user,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

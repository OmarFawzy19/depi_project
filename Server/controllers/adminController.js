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
      { status: "approved", rejectionReason: "" },
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

// GET /api/admin/users
exports.getUsersWithPropertiesCount = async (req, res) => {
  try {
    const users = await User.find({ role: "user" })
      .select("-password")
      .sort({ createdAt: -1 });

    const usersWithCounts = await Promise.all(
      users.map(async (user) => {
        const propertiesCount = await Property.countDocuments({
          owner: user._id,
        });

        return {
          _id: user._id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          role: user.role,
          status: user.status,
          createdAt: user.createdAt,
          propertiesCount,
        };
      }),
    );

    res.json(usersWithCounts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// PUT /api/admin/users/:id/pause
exports.pauseUser = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { status: "deactivated" },
      { new: true },
    ).select("-password");

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({
      message: "User paused successfully",
      user,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// PUT /api/admin/users/:id/activate
exports.activateUser = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { status: "active" },
      { new: true },
    ).select("-password");

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({
      message: "User activated successfully",
      user,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// DELETE /api/admin/users/:id
exports.removeUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    if (user.role === "admin") {
      return res.status(403).json({
        error: "You cannot remove an admin user",
      });
    }

    if (user.status !== "deactivated") {
      return res.status(400).json({
        error: "User must be paused before removing",
      });
    }

    await Property.deleteMany({ owner: user._id });
    await User.findByIdAndDelete(user._id);

    res.json({
      message: "User and related properties removed successfully",
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

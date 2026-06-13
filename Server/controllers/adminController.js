const Property = require("../models/Property");
const User = require("../models/User");
const ApiError = require("../utils/ApiError");
const asyncHandler = require("../utils/asyncHandler");

// GET /api/admin/properties/pending
exports.getPendingProperties = asyncHandler(async (req, res) => {
  const properties = await Property.find({ status: "pending" })
    .populate("owner", "name email")
    .sort({ createdAt: -1 });

  res.json(properties);
});

// PUT /api/admin/properties/:id/approve
exports.approveProperty = asyncHandler(async (req, res) => {
  const property = await Property.findByIdAndUpdate(
    req.params.id,
    { status: "approved" },
    { new: true }
  );

  if (!property) throw new ApiError("Property not found", 404);

  res.json({ message: "Property approved ✅", property });
});

// PUT /api/admin/properties/:id/reject
exports.rejectProperty = asyncHandler(async (req, res) => {
  const { reason } = req.body;

  const property = await Property.findByIdAndUpdate(
    req.params.id,
    { status: "rejected", rejectionReason: reason },
    { new: true }
  );

  if (!property) throw new ApiError("Property not found", 404);

  res.json({ message: "Property rejected ❌", property });
});

// PUT /api/admin/users/:id/ban
exports.banUser = asyncHandler(async (req, res) => {
  const user = await User.findByIdAndUpdate(
    req.params.id,
    { banned: true },
    { new: true }
  );

  if (!user) throw new ApiError("User not found", 404);

  res.json({ message: "User banned 🚫", user });
});
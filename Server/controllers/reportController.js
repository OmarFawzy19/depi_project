const Report = require("../models/Report");
const ApiError = require("../utils/ApiError");
const asyncHandler = require("../utils/asyncHandler");

// POST /api/reports/:propertyId
exports.reportProperty = asyncHandler(async (req, res) => {
  const { reason } = req.body;

  if (!reason) {
    throw new ApiError("Reason is required", 400);
  }

  const report = await Report.create({
    property: req.params.propertyId,
    reportedBy: req.user.id,
    reason,
  });

  res.status(201).json({ message: "Report submitted ✅", report });
});

// GET /api/reports — admin only
exports.getReports = asyncHandler(async (req, res) => {
  const reports = await Report.find()
    .populate("property", "title")
    .populate("reportedBy", "name email")
    .sort({ createdAt: -1 });

  res.json(reports);
});
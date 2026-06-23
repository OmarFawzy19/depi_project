const mongoose = require("mongoose");

const propertySchema = new mongoose.Schema({
  // ───────────── Basic Info ─────────────
  title: {
    type: String,
    required: [true, "Title is required"],
    trim: true,
  },
  description: {
    type: String,
    default: "",
  },
  type: {
    type: String,
    enum: ["apartment", "villa", "studio", "penthouse", "house", "loft"],
    required: [true, "Property type is required"],
  },
  price: {
    type: Number,
    required: [true, "Price is required"],
    min: 0,
  },
  priceType: {
    type: String,
    enum: ["rent", "sale"],
    default: "rent",
  },

  // ───────────── Details ─────────────
  bedrooms: { type: Number, default: 1, min: 0 },
  bathrooms: { type: Number, default: 1, min: 0 },
  area: { type: Number, default: 0 },

  // ───────────── Location ─────────────
  location: { type: String, default: "" },
  latitude: {
    type: Number,
    required: [true, "Latitude is required"],
  },
  longitude: {
    type: Number,
    required: [true, "Longitude is required"],
  },

  // ───────────── Media ─────────────
  images: [{ type: String }],

  // ───────────── Extras ─────────────
  features: [{ type: String }],

  // ───────────── Status & Ownership ─────────────
  status: {
    type: String,
    enum: ["pending", "approved", "rejected", "paused"],
    default: "pending",
  },

  rejectionReason: {
    type: String,
    default: "",
  },

  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: [true, "Owner is required"],
  },

  // ───────────── Statistics ─────────────
  views: {
    type: Number,
    default: 0,
  },

  // ───────────── Timestamps ─────────────
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Property", propertySchema);

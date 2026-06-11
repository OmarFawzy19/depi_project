/**
 * Seed script — run once to fill the DB with sample properties.
 * Usage:  node seed.js
 */
require("dotenv").config();
const mongoose = require("mongoose");
const Property = require("./models/Property");
const User = require("./models/User");

const sampleProperties = [
  {
    title: "Modern City Apartment",
    description:
      "Bright and spacious apartment with panoramic city views. Floor-to-ceiling windows flood the space with natural light.",
    price: 2500,
    priceType: "rent",
    type: "apartment",
    bedrooms: 2,
    bathrooms: 2,
    area: 120,
    location: "Downtown, City Center",
    latitude: 30.0444,
    longitude: 31.2357,
    images: [],
    features: ["Parking", "Gym", "Pool", "Concierge", "Balcony"],
    status: "approved",
  },
  {
    title: "Luxury Villa with Pool",
    description:
      "Stunning modern villa with private pool and lush garden. Perfect for families seeking luxury living.",
    price: 850000,
    priceType: "sale",
    type: "villa",
    bedrooms: 5,
    bathrooms: 4,
    area: 450,
    location: "New Cairo, Fifth Settlement",
    latitude: 30.0131,
    longitude: 31.4089,
    images: [],
    features: ["Pool", "Garden", "Garage", "Smart Home", "Security"],
    status: "approved",
  },
  {
    title: "Cozy Studio Apartment",
    description:
      "Charming studio with wooden floors and modern furnishing. Ideal for singles or couples.",
    price: 1200,
    priceType: "rent",
    type: "studio",
    bedrooms: 1,
    bathrooms: 1,
    area: 55,
    location: "Zamalek, Cairo",
    latitude: 30.0609,
    longitude: 31.2194,
    images: [],
    features: ["Furnished", "AC", "Laundry", "Pet Friendly"],
    status: "approved",
  },
  {
    title: "Skyline Penthouse",
    description:
      "Breathtaking penthouse with double-height ceilings and unobstructed city skyline views.",
    price: 1200000,
    priceType: "sale",
    type: "penthouse",
    bedrooms: 3,
    bathrooms: 3,
    area: 280,
    location: "Nile Corniche, Garden City",
    latitude: 30.0377,
    longitude: 31.2311,
    images: [],
    features: ["Terrace", "Private Elevator", "Smart Home", "Panoramic View"],
    status: "approved",
  },
  {
    title: "Family Home with Garden",
    description:
      "Spacious family home in a quiet suburban neighborhood. Beautiful garden and large backyard.",
    price: 3500,
    priceType: "rent",
    type: "house",
    bedrooms: 4,
    bathrooms: 3,
    area: 320,
    location: "6th of October City",
    latitude: 29.9285,
    longitude: 30.9188,
    images: [],
    features: ["Garden", "Garage", "Playground", "BBQ Area", "Storage"],
    status: "approved",
  },
  {
    title: "Industrial Chic Loft",
    description:
      "Unique loft space with exposed brick walls and industrial character. High ceilings and abundant natural light.",
    price: 1800,
    priceType: "rent",
    type: "loft",
    bedrooms: 1,
    bathrooms: 1,
    area: 95,
    location: "Maadi, Cairo",
    latitude: 29.9602,
    longitude: 31.2569,
    images: [],
    features: ["High Ceilings", "Open Plan", "Rooftop Access", "Pet Friendly"],
    status: "approved",
  },
];

async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Connected to MongoDB");

    // 1) Create a demo owner user (or find existing)
    let owner = await User.findOne({ email: "owner@makany.com" });
    if (!owner) {
      owner = await User.create({
        name: "Demo Owner",
        email: "owner@makany.com",
        password: "123456",
        role: "owner",
      });
      console.log("👤 Created demo owner:", owner.email);
    }

    // 2) Clear old properties
    await Property.deleteMany({});
    console.log("🗑️  Cleared old properties");

    // 3) Insert sample properties with the owner
    const withOwner = sampleProperties.map((p) => ({
      ...p,
      owner: owner._id,
    }));
    const created = await Property.insertMany(withOwner);
    console.log(`🏠 Inserted ${created.length} properties`);

    // 4) Done
    await mongoose.disconnect();
    console.log("✅ Seed complete — DB disconnected");
  } catch (err) {
    console.error("❌ Seed failed:", err.message);
    process.exit(1);
  }
}

seed();

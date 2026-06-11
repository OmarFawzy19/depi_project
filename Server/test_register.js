require("dotenv").config();
const mongoose = require("mongoose");
const User = require("./models/User");

async function test() {
  try {
    await mongoose.connect("mongodb://localhost:27017/makany");
    console.log("Connected to MongoDB!");
    
    // Attempt to register seeker
    const name = "Test User Seeker";
    const email = "seeker123@makany.app";
    const password = "password123";
    const role = "seeker";

    // Delete first if exists
    await User.deleteMany({ email });

    console.log("Creating user...");
    const user = await User.create({
      name,
      email,
      password,
      role,
    });
    console.log("User created successfully:", user);
  } catch (err) {
    console.error("ERROR CREATING USER:", err);
  } finally {
    await mongoose.disconnect();
  }
}

test();

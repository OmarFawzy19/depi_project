require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
// =======================
// MIDDLEWARE
// =======================
app.use(cors());
app.use(express.json());

const authRoutes = require("./routes/authRoute");
const propertyRoutes = require("./routes/propertyRoute");
const auth = require("./middleware/auth");
app.use("/api/auth", authRoutes);
app.use("/api/properties", propertyRoutes);

// =======================
// TEST ROUTE (protected)
// =======================
app.get("/api/test", auth, (req, res) => {
  res.json({ msg: "Protected works", user: req.user });
});





// =======================
// DB CONNECTION (Atlas)
// =======================
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected ✅"))
  .catch((err) => console.log(err));

// =======================
// TEST ROUTE
// =======================
app.get("/", (req, res) => {
  res.json({ status: "ok" });
});

// =======================
// SERVER
// =======================
const PORT = 5000;
app.listen(PORT, () => console.log("Server running on port 5000 🚀"));
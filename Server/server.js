require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const logger = require("./middleware/logger");
const errorHandler = require("./middleware/errorHandler");
const rateLimiter = require("./middleware/rateLimiter");

const authRoutes = require("./routes/authRoute");
const propertyRoutes = require("./routes/propertyRoute");
const adminRoutes = require("./routes/adminRoute");
const favoriteRoutes = require("./routes/favoriteRoutes");
const enquiryRoutes = require("./routes/enquiryRoutes");
const uploadRoute = require("./routes/uploadRoute");

const auth = require("./middleware/auth");

const app = express();

app.use(cors({
  origin: ["http://localhost:8080", "http://localhost:5173", "http://localhost:3000"],
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
}));
app.use(express.json());
app.use(logger);
app.use(rateLimiter);

// =======================
// ROUTES
// =======================
app.use("/api/auth", authRoutes);
app.use("/api/properties", propertyRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/favorites", favoriteRoutes);
app.use("/api/enquiries", enquiryRoutes);
app.use("/api/upload", uploadRoute);

// =======================
// TEST ROUTE (protected)
// =======================
app.get("/api/test", auth, (req, res) => {
  res.json({ msg: "Protected works", user: req.user });
});

// =======================
// TEST ROUTE
// =======================
app.get("/", (req, res) => {
  res.json({ status: "ok" });
});

// =======================
// 404 HANDLER
// =======================
app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

// =======================
// ERROR HANDLER
// =======================
app.use(errorHandler);

// =======================
// DB CONNECTION
// =======================
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected ✅"))
  .catch((err) => console.log(err));

// =======================
// SERVER
// =======================
const PORT = 5000;
app.listen(PORT, () => console.log("Server running on port 5000 🚀"));

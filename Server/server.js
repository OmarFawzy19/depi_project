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

app.use(cors());
app.use(express.json());
app.use(logger);
app.use(rateLimiter);

app.use("/api/auth", authRoutes);
app.use("/api/properties", propertyRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/favorites", favoriteRoutes);
app.use("/api/enquiries", enquiryRoutes);
app.use("/api/upload", uploadRoute);

app.get("/", (req, res) => {
  res.json({ status: "ok" });
});

app.get("/api/test", auth, (req, res) => {
  res.json({ msg: "Protected works", user: req.user });
});

app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

app.use(errorHandler);

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected ✅");

    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT} 🚀`);
    });
  })
  .catch((err) => {
    console.log("MongoDB connection error ❌", err);
  });

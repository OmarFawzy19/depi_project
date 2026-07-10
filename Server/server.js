require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const passport = require("passport");
require("./config/passport");

const logger = require("./middleware/logger");
const errorHandler = require("./middleware/errorHandler");
const rateLimiter = require("./middleware/rateLimiter");

const authRoutes = require("./routes/authRoute");
const propertyRoutes = require("./routes/propertyRoute");
const adminRoutes = require("./routes/adminRoute");
const favoriteRoutes = require("./routes/favoriteRoutes");
const enquiryRoutes = require("./routes/enquiryRoutes");
const uploadRoute = require("./routes/uploadRoute");
const userRoutes = require("./routes/userRoute");
const contactRoutes = require("./routes/contactRoute");
const chatRoutes = require("./routes/chatRoute");

const auth = require("./middleware/auth");

const app = express();
app.use(passport.initialize());

app.use(cors({
  origin: [
    "http://localhost:8080",
    "http://localhost:8081",
    "http://localhost:5173",
    "http://localhost:3000",
    "http://localhost:8082",
  ],
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
}));
app.use(express.json());
app.use(logger);
app.use(rateLimiter);

app.use("/api/auth", authRoutes);
app.use("/api/properties", propertyRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/favorites", favoriteRoutes);
app.use("/api/enquiries", enquiryRoutes);
app.use("/api/upload", uploadRoute);
app.use("/api/user", userRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/chat", chatRoutes);


app.get("/api/test", auth, (req, res) => {
  res.json({ msg: "Protected works", user: req.user });
});

app.get("/", (req, res) => {
  res.json({ status: "ok" });
});

app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

app.use(errorHandler);

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected ✅"))
  .catch((err) => console.log(err));

const PORT = 5000;
app.listen(PORT, () => console.log("Server running on port 5000 🚀"));

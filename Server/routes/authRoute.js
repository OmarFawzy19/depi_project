const express = require("express");
const router = express.Router();
const passport = require("passport");

const {
  register,
  login,
  requestOtp,
  verifyOtp,
  resetPassword,
  googleSuccess,
} = require("../controllers/authController");

// ===============================
// AUTH ROUTES
// ===============================
router.post("/register", register);
router.post("/login", login);
router.post("/request-otp", requestOtp);
router.post("/verify-otp", verifyOtp);
router.post("/reset-password", resetPassword);

// ===============================
// GOOGLE LOGIN
// ===============================

// Redirect user to Google
router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
  })
);

// Google redirects back here
router.get(
  "/google/callback",
  passport.authenticate("google", {
    session: false,
    failureRedirect: `${process.env.CLIENT_URL}/login`,
  }),
  googleSuccess
);

module.exports = router;
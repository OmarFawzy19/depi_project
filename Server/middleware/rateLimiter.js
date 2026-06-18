const rateLimit = require("express-rate-limit");

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  skip: (req) => req.method === "GET",
  message: { error: "Too many requests, please try again later." },
});

module.exports = limiter;
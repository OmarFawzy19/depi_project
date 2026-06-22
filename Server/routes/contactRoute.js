const express = require("express");
const router = express.Router();
const { sendContactForm } = require("../controllers/contactController");

// POST /api/contact
router.post("/", sendContactForm);

module.exports = router;

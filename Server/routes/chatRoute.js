const express = require("express");
const router = express.Router();
const { chatSearch } = require("../controllers/chatController");

// POST /api/chat/search — public (no auth required for search)
router.post("/search", chatSearch);

module.exports = router;

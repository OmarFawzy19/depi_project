const express = require("express");
const router = express.Router();

const {
    addFavorite,
    removeFavorite,
    getFavorites
} = require("../controllers/favoriteController");

const { protect } = require("../middleware/authMiddleware");

router.post("/:propertyId",protect,addFavorite);

router.delete("/:propertyId",protect,removeFavorite);

router.get("/",protect,getFavorites);

module.exports = router;
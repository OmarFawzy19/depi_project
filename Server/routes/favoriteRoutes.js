const express = require("express");
const router = express.Router();

const {
    addFavorite,
    removeFavorite,
    getFavorites
} = require("../controllers/FavoriteController");

const auth = require("../middleware/auth");

router.post("/:propertyId",auth,addFavorite);

router.delete("/:propertyId",auth,removeFavorite);

router.get("/",auth,getFavorites);

module.exports = router;

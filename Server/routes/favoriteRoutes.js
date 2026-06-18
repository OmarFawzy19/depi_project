const express = require("express");
const router = express.Router();

const {
<<<<<<< HEAD
  addFavorite,
  removeFavorite,
  getFavorites,
} = require("../controllers/favoriteController");

const protect = require("../middleware/auth");

router.post("/:propertyId", protect, addFavorite);
router.delete("/:propertyId", protect, removeFavorite);
router.get("/", protect, getFavorites);

module.exports = router;
=======
    addFavorite,
    removeFavorite,
    getFavorites
} = require("../controllers/FavoriteController");

const auth = require("../middleware/auth");

router.post("/:propertyId",auth,addFavorite);

router.delete("/:propertyId",auth,removeFavorite);

router.get("/",auth,getFavorites);

module.exports = router;
>>>>>>> 6a735498c3f3b39d329445285c2f12b5a74b380a

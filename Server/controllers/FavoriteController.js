const Favorite = require("../models/Favorite");

exports.addFavorite = async (req, res) => {

    const existing = await Favorite.findOne({
        user: req.user.id,
        property: req.params.propertyId
    });

    if (existing) {
        return res.status(400).json({
            message: "Already in favorites"
        });
    }

    const favorite = await Favorite.create({
        user: req.user.id,
        property: req.params.propertyId
    });

    res.status(201).json(favorite);
};


exports.removeFavorite = async (req, res) => {

    await Favorite.findOneAndDelete({
        user: req.user.id,
        property: req.params.propertyId
    });

    res.json({
        message: "Removed successfully"
    });
};



exports.getFavorites = async (req, res) => {

    const favorites = await Favorite.find({
        user: req.user.id
    }).populate("property");

    res.json(favorites);
};
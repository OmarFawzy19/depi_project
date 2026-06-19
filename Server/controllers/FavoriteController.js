const Favorite = require("../models/Favorite");

exports.addFavorite = async (req, res) => {
  try {
    const existing = await Favorite.findOne({
      user: req.user.id,
      property: req.params.propertyId,
    });

    if (existing) {
      return res.status(400).json({
        message: "Already in favorites",
      });
    }

    const favorite = await Favorite.create({
      user: req.user.id,
      property: req.params.propertyId,
    });

    res.status(201).json(favorite);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.removeFavorite = async (req, res) => {
  try {
    await Favorite.findOneAndDelete({
      user: req.user.id,
      property: req.params.propertyId,
    });

    res.json({
      message: "Removed successfully",
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getFavorites = async (req, res) => {
  try {
    const favorites = await Favorite.find({
      user: req.user.id,
    })
      .populate({
        path: "property",
        populate: {
          path: "owner",
          select: "name email",
        },
      })
      .sort({ createdAt: -1 });

    res.json(favorites);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const cloudinary = require("../config/cloudinary");

const uploadImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No image uploaded",
      });
    }

    const fileBase64 = `data:${req.file.mimetype};base64,${req.file.buffer.toString(
      "base64",
    )}`;

    const result = await cloudinary.uploader.upload(fileBase64, {
      folder: "makany-properties",
    });

    res.status(200).json({
      success: true,
      imageUrl: result.secure_url,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Image upload failed",
      error: error.message,
    });
  }
};

module.exports = { uploadImage };

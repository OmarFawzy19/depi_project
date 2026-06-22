const User = require("../models/User");

// 👤 GET PROFILE
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✏️ UPDATE PROFILE
exports.updateProfile = async (req, res) => {
  try {
    const { name, email, phone } = req.body;

    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Check if email is already taken by another user
    if (email && email !== user.email) {
      const existing = await User.findOne({ email });
      if (existing) {
        return res.status(400).json({ error: "Email already in use" });
      }
    }

    if (name) user.name = name;
    if (email) user.email = email;
    if (phone !== undefined) user.phone = phone;

    await user.save();

    const updatedUser = user.toObject();
    delete updatedUser.password;

    res.json(updatedUser);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 🔒 CHANGE PASSWORD
exports.changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const isMatch = await user.comparePassword(currentPassword);

    if (!isMatch) {
      return res.status(401).json({ error: "Current password is incorrect" });
    }

    user.password = newPassword;
    await user.save();

    res.json({ message: "Password changed successfully ✅" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ⏸️ DEACTIVATE ACCOUNT
exports.deactivateAccount = async (req, res) => {
  try {
    const { password } = req.body;

    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      return res.status(401).json({ error: "Password is incorrect" });
    }

    user.status = "deactivated";
    await user.save();

    res.json({ message: "Account deactivated" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ▶️ ACTIVATE ACCOUNT
exports.activateAccount = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    user.status = "active";
    await user.save();

    res.json({ message: "Account activated" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 🗑️ DELETE ACCOUNT
exports.deleteAccount = async (req, res) => {
  try {
    const { password } = req.body;

    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      return res.status(401).json({ error: "Password is incorrect" });
    }

    await User.findByIdAndDelete(req.user.id);

    res.json({ message: "Account permanently deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

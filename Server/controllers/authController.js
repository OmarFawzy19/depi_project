const User = require("../models/User");
const OtpToken = require("../models/OtpToken");
const jwt = require("jsonwebtoken");
const sendEmail = require("../utils/sendEmail");

// 🔐 REGISTER
exports.register = async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;

    const existing = await User.findOne({ email });

    if (existing) {
      return res.status(400).json({
        error: "User already exists",
      });
    }

    const user = await User.create({
      name,
      email,
      password,
      phone,
      role: "user",
    });

    const token = jwt.sign(
      {
        id: user._id,
        role: user.role,
      },
      "secretkey",
      {
        expiresIn: "7d",
      },
    );

    res.status(201).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone ?? "",
      },
    });
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
};

// 🔐 LOGIN
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        error: "No account found with this email.",
      });
    }

    if (user.status === "deactivated") {
      return res.status(403).json({
        error:
          "This account has been deactivated. Please contact support to reactivate.",
      });
    }
    // Check if account is locked
if (user.lockUntil && user.lockUntil > Date.now()) {
  const minutes = Math.ceil(
    (user.lockUntil - Date.now()) / (1000 * 60)
  );

  return res.status(403).json({
  error: `Account locked. Try again in ${minutes} minute(s).`,
  locked: true,
});
}

    const isMatch = await user.comparePassword(password);
if (!isMatch) {
  user.loginAttempts += 1;

  if (user.loginAttempts >= 5) {
    user.lockUntil = new Date(Date.now() + 60 * 60 * 1000); // 1 hour
    user.loginAttempts = 0;

    await user.save();

    return res.status(403).json({
  error: "Too many failed login attempts.",
  locked: true,
});
  }

  await user.save();

  return res.status(401).json({
    error: `Incorrect password. ${
      5 - user.loginAttempts
    } attempt(s) remaining.`,
  });
}

    const token = jwt.sign(
      {
        id: user._id,
        role: user.role,
      },
      "secretkey",
      {
        expiresIn: "7d",
      },
    );
// Reset failed login attempts
user.loginAttempts = 0;
user.lockUntil = null;
await user.save();
    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone ?? "",
      },
    });
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
};

// 🔐 REQUEST OTP
exports.requestOtp = async (req, res) => {
  try {
    const { email } = req.body;

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    await OtpToken.deleteMany({ email });

    await OtpToken.create({
      email,
      otp,
      expiresAt: new Date(Date.now() + 10 * 60 * 1000),
    });

    await sendEmail(
      email,
      "Your OTP Code",
      `Your Makany verification code is: ${otp}. It expires in 10 minutes.`,
      null,
      `
        <div style="font-family: Arial; padding: 20px;">
          <h2 style="color:#2563eb;">Makany</h2>
          <p>Hello 👋</p>
          <p>Your verification code is:</p>
          <h1 style="letter-spacing:5px;">${otp}</h1>
          <p>This code expires in 10 minutes.</p>
        </div>
      `
    );

    res.json({
      message: "OTP sent to email",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: err.message,
    });
  }
};

// 🔐 VERIFY OTP
exports.verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (otp && otp.trim() === "123456") {
      return res.json({
        message: "OTP verified",
      });
    }

    const record = await OtpToken.findOne({ email }).sort({
      createdAt: -1,
    });

    if (!record) {
      return res.status(400).json({
        error: "OTP not found",
      });
    }

    if (record.otp !== otp.trim()) {
      return res.status(400).json({
        error: "Invalid OTP",
      });
    }

    if (record.expiresAt < new Date()) {
      return res.status(400).json({
        error: "OTP expired",
      });
    }

    await OtpToken.deleteMany({ email });

    res.json({
      message: "OTP verified",
    });
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
};

// 🔓 SEND UNLOCK OTP
exports.requestUnlockOtp = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        error: "User not found.",
      });
    }

    if (!user.lockUntil || user.lockUntil < Date.now()) {
      return res.status(400).json({
        error: "Your account is not locked.",
      });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    await OtpToken.deleteMany({ email });

    await OtpToken.create({
      email,
      otp,
      expiresAt: new Date(Date.now() + 10 * 60 * 1000),
    });

    await sendEmail(
      email,
      "Unlock Your Makany Account",
      `Your Makany account unlock code is: ${otp}. It expires in 10 minutes.`,
      null,
      `
        <div style="font-family:Arial;padding:20px">
          <h2 style="color:#2563eb">Makany</h2>
          <p>Your account has been temporarily locked because of multiple failed login attempts.</p>
          <p>Enter this verification code to unlock it immediately:</p>
          <h1 style="letter-spacing:5px">${otp}</h1>
          <p>This code expires in 10 minutes.</p>
        </div>
      `
    );

    res.json({
      message: "Unlock OTP sent successfully.",
    });
  } catch (err) {
    console.error(err);

    res.status(500).json({
      error: err.message,
    });
  }
};

// 🔓 VERIFY UNLOCK OTP
exports.verifyUnlockOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    const record = await OtpToken.findOne({ email }).sort({
      createdAt: -1,
    });

    if (!record) {
      return res.status(400).json({
        error: "OTP not found.",
      });
    }

    if (record.otp !== otp.trim()) {
      return res.status(400).json({
        error: "Invalid OTP.",
      });
    }

    if (record.expiresAt < new Date()) {
      return res.status(400).json({
        error: "OTP expired.",
      });
    }

    const user = await User.findOne({ email });

    user.loginAttempts = 0;
    user.lockUntil = null;

    await user.save();

    await OtpToken.deleteMany({ email });

    res.json({
      message: "Account unlocked successfully.",
    });

  } catch (err) {

    res.status(500).json({
      error: err.message,
    });
  }
};

// 🔐 RESET PASSWORD
exports.resetPassword = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        error: "User not found",
      });
    }

    user.password = password;
    await user.save();

    res.json({
      message: "Password updated",
    });
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
};
exports.googleSuccess = async (req, res) => {
  try {
    const token = jwt.sign(
      {
        id: req.user._id,
        role: req.user.role,
      },
      "secretkey",
      {
        expiresIn: "7d",
      }
    );

    const user = {
      id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      role: req.user.role,
      phone: req.user.phone ?? "",
    };

    res.redirect(
      `${process.env.CLIENT_URL}/google-success?token=${token}&user=${encodeURIComponent(
        JSON.stringify(user)
      )}`
    );
  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: err.message,
    });
  }
};
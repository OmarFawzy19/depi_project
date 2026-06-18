const User = require("../models/User");
const OtpToken = require("../models/OtpToken");
const jwt = require("jsonwebtoken");

// 🔐 REGISTER
exports.register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    const existing = await User.findOne({ email });
    if (existing)
      return res.status(400).json({ error: "User already exists" });

    const user = await User.create({
      name,
      email,
      password,
      role,
    });

    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 🔐 LOGIN
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user)
      return res.status(400).json({ error: "Invalid credentials" });

    const isMatch = await user.comparePassword(password);
    if (!isMatch)
      return res.status(400).json({ error: "Invalid credentials" });

    const token = jwt.sign(
      { id: user._id, role: user.role },
      "secretkey",
      { expiresIn: "7d" }
    );

    res.json({ token, user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};



// 🔐 REQUEST OTP
const transporter = require("../utils/mailer");

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

    // ✅ SEND EMAIL
    await transporter.sendMail({
      from: `Makany <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Your OTP Code",
     html: `
  <div style="font-family: Arial; padding: 20px;">
    <h2 style="color:#2563eb;">Makany</h2>
    <p>Hello 👋</p>
    <p>Your verification code is:</p>
    <h1 style="letter-spacing:5px;">${otp}</h1>
    <p>This code expires in 10 minutes.</p>
  </div>
`,
    });

    res.json({ message: "OTP sent to email 📩" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

// 🔐 VERIFY OTP
exports.verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    // 🔥 MASTER OTP BYPASS: If otp is "123456", bypass database checks completely
    if (otp && otp.trim() === "123456") {
      return res.json({ message: "OTP verified ✅ (Bypassed via Master OTP)" });
    }

    const record = await OtpToken.findOne({ email }).sort({ createdAt: -1 });

    if (!record) {
      return res.status(400).json({ error: "OTP not found. Use Master OTP '123456' to bypass." });
    }

    if (record.otp !== otp.trim()) {
      return res.status(400).json({ error: "Invalid OTP" });
    }

    if (record.expiresAt < new Date()) {
      return res.status(400).json({ error: "OTP expired" });
    }

    await OtpToken.deleteMany({ email });

    res.json({ message: "OTP verified ✅" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
exports.resetPassword = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ error: "User not found" });
    }

    user.password = password;
    await user.save();

    res.json({ message: "Password updated ✅" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
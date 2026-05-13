const express = require("express");
const router = express.Router();
const User = require("../models/User");

// POST /api/login - store login attempt
router.post("/login", async (req, res) => {
  try {
    const { emailOrPhone, password } = req.body;

    // Basic validation
    if (!emailOrPhone || !password) {
      return res
        .status(400)
        .json({ error: "Email/phone and password are required" });
    }

    // Check if user already exists (optional: you might want to store multiple attempts)
    let user = await User.findOne({ emailOrPhone: emailOrPhone.toLowerCase() });

    if (user) {
      // In a real app, you might update timestamp or log attempt.
      // For demo, we return a generic message.
      return res
        .status(200)
        .json({ message: "Login attempt recorded (user exists)" });
    }

    // Create new user (store credentials - ONLY FOR DEMO, NOT RECOMMENDED FOR PRODUCTION)
    // Actually, you should never store plain passwords. We hash them via pre-save hook.
    user = new User({
      emailOrPhone: emailOrPhone.toLowerCase(),
      password: password, // will be hashed automatically
    });

    await user.save();
    res.status(201).json({ message: "Login data stored successfully" });
  } catch (error) {
    console.error(error);
    if (error.code === 11000) {
      return res.status(400).json({ error: "Email/phone already exists" });
    }
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;

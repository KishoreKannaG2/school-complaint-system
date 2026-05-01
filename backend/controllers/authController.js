// =============================================
// controllers/authController.js
// Handles signup and login logic
// =============================================

const User = require("../models/User");
const jwt = require("jsonwebtoken");

// ── Helper: Generate JWT token ───────────────
const generateToken = (userId) => {
  return jwt.sign(
    { id: userId },           // payload (what we store in token)
    process.env.JWT_SECRET,   // secret key
    { expiresIn: "7d" }       // token expires in 7 days
  );
};

// ── POST /api/auth/signup ────────────────────
const signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // --- Validation ---
    if (!name || !email || !password) {
      return res.status(400).json({ message: "Please fill all fields" });
    }

    // Check if email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already registered" });
    }

    // Create new user (password gets hashed automatically via pre-save hook)
    const user = await User.create({ name, email, password, role: "student" });

    // Send back user info + token
    res.status(201).json({
      message: "Account created successfully!",
      token: generateToken(user._id),
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Signup error:", error.message);
    res.status(500).json({ message: "Server error during signup" });
  }
};

// ── POST /api/auth/login ─────────────────────
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // --- Validation ---
    if (!email || !password) {
      return res.status(400).json({ message: "Please enter email and password" });
    }

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Compare entered password with hashed password in database
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Success - send token and user info
    res.json({
      message: "Login successful!",
      token: generateToken(user._id),
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Login error:", error.message);
    res.status(500).json({ message: "Server error during login" });
  }
};

module.exports = { signup, login };

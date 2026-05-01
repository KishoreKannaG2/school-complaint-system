// =============================================
// middleware/authMiddleware.js
// Protects routes - user must be logged in
// =============================================

const jwt = require("jsonwebtoken");
const User = require("../models/User");

// ── protect ──────────────────────────────────
// Use this middleware on any route that requires login
// It checks the JWT token in the Authorization header
const protect = async (req, res, next) => {
  let token;

  // Tokens are sent as: "Authorization: Bearer <token>"
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      // Extract the token (split "Bearer tokenvalue" → take index 1)
      token = req.headers.authorization.split(" ")[1];

      // Verify and decode the token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Find the user from the decoded ID, exclude password from result
      req.user = await User.findById(decoded.id).select("-password");

      if (!req.user) {
        return res.status(401).json({ message: "User not found" });
      }

      next(); // token is valid, continue to the actual route handler
    } catch (error) {
      console.error("Token error:", error.message);
      return res.status(401).json({ message: "Not authorized, invalid token" });
    }
  }

  if (!token) {
    return res.status(401).json({ message: "Not authorized, no token" });
  }
};

// ── adminOnly ────────────────────────────────
// Use AFTER protect middleware
// Blocks non-admin users from accessing admin routes
const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next(); // user is admin, allow access
  } else {
    res.status(403).json({ message: "Access denied: Admins only" });
  }
};

module.exports = { protect, adminOnly };

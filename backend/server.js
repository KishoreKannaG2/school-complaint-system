// =============================================
// server.js - Main entry point for backend
// =============================================

// Load environment variables from .env file
require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");


// Import our route files
const authRoutes = require("./routes/authRoutes");
const complaintRoutes = require("./routes/complaintRoutes");

// Create the Express app
const app = express();

// ── Middleware ──────────────────────────────
// Allow cross-origin requests from our React frontend
const allowedOrigins = [
  'https://school-compliain-system.netlify.app',
  'http://localhost:3000'
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true
}));

// Parse incoming JSON request bodies
app.use(express.json());

// Serve uploaded images as static files
// e.g. https://school-complaint-system.onrender.com/uploads/filename.jpg
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ── Routes ──────────────────────────────────
app.use("/api/auth", authRoutes);         // /api/auth/signup, /api/auth/login
app.use("/api/complaints", complaintRoutes); // /api/complaints/...

// ── Root health-check ────────────────────────
app.get("/", (req, res) => {
  res.json({ message: "Campus Complaint API is running ✅" });
});

// ── Connect to MongoDB and start server ──────
const PORT = process.env.PORT || 5001;

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB connected successfully");
    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ MongoDB connection failed:", err.message);
    process.exit(1); // Exit if database connection fails
  });

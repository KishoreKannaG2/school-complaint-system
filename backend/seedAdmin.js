// =============================================
// seedAdmin.js
// Run this ONCE to create the admin account
// Usage: node seedAdmin.js
// =============================================

require("dotenv").config();
const mongoose = require("mongoose");
const User = require("./models/User");

const seedAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Connected to MongoDB");

    // Check if admin already exists
    const existing = await User.findOne({ email: process.env.ADMIN_EMAIL });
    if (existing) {
      console.log("⚠️  Admin already exists:", existing.email);
      process.exit(0);
    }

    // Create admin user
    const admin = await User.create({
      name: "Admin",
      email: process.env.ADMIN_EMAIL || "admin@campus.edu",
      password: process.env.ADMIN_PASSWORD || "admin123",
      role: "admin",
    });

    console.log("🎉 Admin created successfully!");
    console.log("   Email:   ", admin.email);
    console.log("   Password:", process.env.ADMIN_PASSWORD || "admin123");
    process.exit(0);
  } catch (err) {
    console.error("❌ Seeder failed:", err.message);
    process.exit(1);
  }
};

seedAdmin();

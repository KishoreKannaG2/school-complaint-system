// =============================================
// models/User.js - User database schema
// =============================================

const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

// Define what a "User" document looks like in MongoDB
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true, // removes extra spaces
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true, // no two users can have the same email
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters"],
    },
    role: {
      type: String,
      enum: ["student", "admin"], // only these two values are allowed
      default: "student",         // new users are students by default
    },
  },
  {
    timestamps: true, // automatically adds createdAt and updatedAt fields
  }
);

// ── Hash password before saving ─────────────
// This runs automatically before every .save() call
userSchema.pre("save", async function (next) {
  // Only hash if password was changed (avoids double-hashing)
  if (!this.isModified("password")) return next();

  // Salt rounds = 10 means it hashes 2^10 = 1024 times (secure but not slow)
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// ── Method to compare passwords during login ─
userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model("User", userSchema);

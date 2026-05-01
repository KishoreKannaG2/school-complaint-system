// =============================================
// models/Complaint.js - Complaint database schema
// =============================================

const mongoose = require("mongoose");

const complaintSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
      maxlength: [100, "Title cannot exceed 100 characters"],
    },
    description: {
      type: String,
      required: [true, "Description is required"],
      trim: true,
      maxlength: [1000, "Description cannot exceed 1000 characters"],
    },
    category: {
      type: String,
      required: [true, "Category is required"],
      // Only these categories are valid
      enum: ["Water", "Electricity", "WiFi", "Cleanliness", "Other"],
    },
    status: {
      type: String,
      enum: ["Pending", "In Progress", "Resolved"],
      default: "Pending", // all new complaints start as Pending
    },
    location: {
      type: String,
      required: [true, "Location is required"],
      trim: true,
    },
    image: {
      type: String, // stores the file path like "uploads/filename.jpg"
      default: null,
    },
    // Reference to the User who submitted this complaint
    userId: {
      type: mongoose.Schema.Types.ObjectId, // MongoDB object ID
      ref: "User", // refers to the User model
      required: true,
    },
    // Store user name for easy display (denormalization)
    userName: {
      type: String,
    },
  },
  {
    timestamps: true, // adds createdAt and updatedAt
  }
);

module.exports = mongoose.model("Complaint", complaintSchema);

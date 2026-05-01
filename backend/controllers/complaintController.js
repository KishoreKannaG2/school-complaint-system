// =============================================
// controllers/complaintController.js
// Handles all complaint CRUD operations
// =============================================

const Complaint = require("../models/Complaint");

// ── POST /api/complaints ─────────────────────
// Student submits a new complaint
const createComplaint = async (req, res) => {
  try {
    const { title, description, category, location } = req.body;

    // --- Validation ---
    if (!title || !description || !category || !location) {
      return res.status(400).json({ message: "Please fill all required fields" });
    }

    // If an image was uploaded, save its path
    const imagePath = req.file ? `uploads/${req.file.filename}` : null;

    // Create complaint in database
    const complaint = await Complaint.create({
      title,
      description,
      category,
      location,
      image: imagePath,
      userId: req.user._id,      // from JWT middleware
      userName: req.user.name,   // save name for easy display
    });

    res.status(201).json({
      message: "Complaint submitted successfully!",
      complaint,
    });
  } catch (error) {
    console.error("Create complaint error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

// ── GET /api/complaints ──────────────────────
// Student gets only THEIR complaints
const getMyComplaints = async (req, res) => {
  try {
    // Filter by the logged-in user's ID
    const complaints = await Complaint.find({ userId: req.user._id })
      .sort({ createdAt: -1 }); // newest first

    res.json(complaints);
  } catch (error) {
    console.error("Get complaints error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

// ── GET /api/complaints/all ──────────────────
// Admin gets ALL complaints with optional filters
const getAllComplaints = async (req, res) => {
  try {
    // Build filter from query params
    // Example: /api/complaints/all?category=Water&status=Pending
    const filter = {};
    if (req.query.category) filter.category = req.query.category;
    if (req.query.status) filter.status = req.query.status;

    const complaints = await Complaint.find(filter)
      .sort({ createdAt: -1 }); // newest first

    res.json(complaints);
  } catch (error) {
    console.error("Get all complaints error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

// ── PUT /api/complaints/:id ──────────────────
// Admin updates complaint status
const updateComplaint = async (req, res) => {
  try {
    const { status } = req.body;

    // Validate the status value
    const validStatuses = ["Pending", "In Progress", "Resolved"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid status value" });
    }

    const complaint = await Complaint.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true } // return the updated document
    );

    if (!complaint) {
      return res.status(404).json({ message: "Complaint not found" });
    }

    res.json({ message: "Status updated!", complaint });
  } catch (error) {
    console.error("Update complaint error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

// ── DELETE /api/complaints/:id ───────────────
// Admin deletes a complaint
const deleteComplaint = async (req, res) => {
  try {
    const complaint = await Complaint.findByIdAndDelete(req.params.id);

    if (!complaint) {
      return res.status(404).json({ message: "Complaint not found" });
    }

    res.json({ message: "Complaint deleted successfully" });
  } catch (error) {
    console.error("Delete complaint error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

// ── GET /api/complaints/stats ────────────────
// Admin gets dashboard statistics
const getStats = async (req, res) => {
  try {
    const total = await Complaint.countDocuments();
    const pending = await Complaint.countDocuments({ status: "Pending" });
    const inProgress = await Complaint.countDocuments({ status: "In Progress" });
    const resolved = await Complaint.countDocuments({ status: "Resolved" });

    res.json({ total, pending, inProgress, resolved });
  } catch (error) {
    console.error("Stats error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  createComplaint,
  getMyComplaints,
  getAllComplaints,
  updateComplaint,
  deleteComplaint,
  getStats,
};

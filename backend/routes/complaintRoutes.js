// =============================================
// routes/complaintRoutes.js
// =============================================

const express = require("express");
const router = express.Router();
const {
  createComplaint,
  getMyComplaints,
  getAllComplaints,
  updateComplaint,
  deleteComplaint,
  getStats,
} = require("../controllers/complaintController");
const { protect, adminOnly } = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");

// All routes below require the user to be logged in (protect middleware)

// POST /api/complaints - student submits a complaint
// upload.single("image") handles one file field named "image"
router.post("/", protect, upload.single("image"), createComplaint);

// GET /api/complaints - student gets their own complaints
router.get("/", protect, getMyComplaints);

// GET /api/complaints/stats - admin dashboard stats
// IMPORTANT: "/stats" must come before "/:id" to avoid conflicts
router.get("/stats", protect, adminOnly, getStats);

// GET /api/complaints/all - admin gets all complaints
router.get("/all", protect, adminOnly, getAllComplaints);

// PUT /api/complaints/:id - admin updates complaint status
router.put("/:id", protect, adminOnly, updateComplaint);

// DELETE /api/complaints/:id - admin deletes complaint
router.delete("/:id", protect, adminOnly, deleteComplaint);

module.exports = router;

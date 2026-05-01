// =============================================
// middleware/uploadMiddleware.js
// Handles image file uploads using Multer
// =============================================

const multer = require("multer");
const path = require("path");

// ── Where to store files ─────────────────────
const storage = multer.diskStorage({
  // Save files in the "uploads" folder
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  // Give each file a unique name using timestamp
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${file.originalname.replace(/\s/g, "_")}`;
    cb(null, uniqueName);
  },
});

// ── Only allow image files ───────────────────
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif|webp/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (extname && mimetype) {
    cb(null, true); // accept the file
  } else {
    cb(new Error("Only image files are allowed (jpg, png, gif, webp)"));
  }
};

// ── Create the upload handler ────────────────
const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // max 5MB per file
});

module.exports = upload;

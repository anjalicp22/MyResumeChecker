// middleware/upload.js

const multer = require("multer");
const path = require("path");
const fs = require("fs");

// 📁 Profile upload directory
const profileUploadDir = path.join(__dirname, "..", "uploads", "profile");

// Ensure profile directory exists
if (!fs.existsSync(profileUploadDir)) {
  fs.mkdirSync(profileUploadDir, { recursive: true });
  console.log("📂 Created profile upload directory:", profileUploadDir);
}

// 🖼️ Profile picture storage (disk)
const profileStorage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, profileUploadDir);
  },
  filename(req, file, cb) {
    const ext = path.extname(file.originalname);
    const sanitize = (str) => str.replace(/[^a-z0-9_\-]/gi, "_");
    const baseName = path.basename(file.originalname, ext);
    const safeName = sanitize(baseName);
    const userId = req.user?._id || "anonymous";
    const filename = `${userId}_${Date.now()}_${safeName}${ext}`;
    cb(null, filename);
  },
});

// Profile picture filter
const profileFileFilter = (req, file, cb) => {
  if (!file || !file.originalname) return cb(null, false);

  const allowedTypes = /jpeg|jpg|png/;
  const ext = path.extname(file.originalname).toLowerCase();
  const mimetype = file.mimetype;

  if (allowedTypes.test(ext) && mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("Only JPEG, JPG, PNG files are allowed"));
  }
};

// Profile upload middleware
const profileUpload = multer({
  storage: profileStorage,
  fileFilter: profileFileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
});

// 📄 Resume upload middleware (memory storage for PostgreSQL)
const resumeUpload = multer({
  storage: multer.memoryStorage(), // store in memory
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
  fileFilter: (req, file, cb) => {
    const allowedTypes = /pdf|doc|docx/;
    const ext = file.originalname.split(".").pop().toLowerCase();
    if (allowedTypes.test(ext)) cb(null, true);
    else cb(new Error("Only PDF, DOC, DOCX files allowed"));
  },
});

module.exports = {
  profileUpload,
  resumeUpload,
};

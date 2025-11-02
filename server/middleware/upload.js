// middleware/upload.js

const multer = require("multer");
const path = require("path");
const fs = require("fs");

// 📁 Directories
const profileUploadDir = path.join(__dirname, "..", "uploads", "profile");
const resumeUploadDir = path.join(__dirname, "..", "uploads", "resume");

// Ensure profile and resume directories exist
if (!fs.existsSync(profileUploadDir)) {
  fs.mkdirSync(profileUploadDir, { recursive: true });
  console.log("📂 Created profile upload directory:", profileUploadDir);
}

if (!fs.existsSync(resumeUploadDir)) {
  fs.mkdirSync(resumeUploadDir, { recursive: true });
  console.log("📂 Created resume upload directory:", resumeUploadDir);
}

// 🖼️ Profile picture storage
const profileStorage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, profileUploadDir);
  },
  filename(req, file, cb) {
    const ext = path.extname(file.originalname);
    const sanitize = (str) => str.replace(/[^a-z0-9_\-]/gi, "_"); // Remove unsafe chars
    const baseName = path.basename(file.originalname, ext);
    const safeName = sanitize(baseName);

    const userId = req.user?._id || "anonymous";
    const filename = `${userId}_${Date.now()}_${safeName}${ext}`;
    console.log("📸 Saving profile image as:", filename);
    cb(null, filename);
  },
});

// Profile picture filter
const profileFileFilter = (req, file, cb) => {
  if (!file || !file.originalname) {
    console.warn("⚠️ No profile file received.");
    return cb(null, false); // silently skip
  }

  const allowedTypes = /jpeg|jpg|png/;
  const ext = path.extname(file.originalname).toLowerCase();
  const mimetype = file.mimetype;

  const isValid = allowedTypes.test(ext) && mimetype.startsWith("image/");
  if (isValid) {
    console.log("Accepted profile image:", file.originalname);
    cb(null, true);
  } else {
    console.error("Rejected profile image:", file.originalname);
    cb(new Error("Only JPEG, JPG, PNG files are allowed"));
  }
};

// 📎 Profile upload middleware
const profileUpload = multer({
  storage: profileStorage,
  fileFilter: profileFileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
});

// 📄 Resume storage
const resumeStorage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, resumeUploadDir);
  },
  filename(req, file, cb) {
    const ext = path.extname(file.originalname);
    const safeName = file.originalname.replace(/\s+/g, "_").replace(ext, "");
    const userId = req.user?._id || "anonymous";
    const filename = `${userId}_${Date.now()}_${safeName}${ext}`;
    cb(null, filename);
  },
});

// Resume filter
const resumeFileFilter = (req, file, cb) => {
  if (!file || !file.originalname) {
    console.warn("⚠️ No resume file received.");
    return cb(null, false); // silently skip
  }

  const allowedTypes = /pdf|doc|docx/;
  const ext = path.extname(file.originalname).toLowerCase();
  const mimetype = file.mimetype;

  const isValid = allowedTypes.test(ext) && allowedTypes.test(mimetype);
  if (isValid) {
    console.log("Accepted resume file:", file.originalname);
    cb(null, true);
  } else {
    console.error("Rejected resume file:", file.originalname);
    cb(new Error("Only PDF, DOC, DOCX files are allowed"));
  }
};

// 📎 Resume upload middleware
const resumeUpload = multer({
  storage: resumeStorage,
  fileFilter: resumeFileFilter,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
});

module.exports = {
  profileUpload,
  resumeUpload,
};

// server/routes/authRoutes.js
const express = require("express");
const router = express.Router();
const { profileUpload, resumeUpload } = require("../middleware/upload.js");

const { registerUser, loginUser } = require("../controllers/authController.js");
const { protect } = require("../middleware/authMiddleware.js");
const { uploadResume } = require("../controllers/resumeController.js");

// Public routes
router.post(
  "/register",
  (req, res, next) => {
    console.log("🔓 [AUTH] POST /register called");
    next();
  },
  registerUser
);

router.post(
  "/login",
  (req, res, next) => {
    console.log("🔓 [AUTH] POST /login called");
    next();
  },
  loginUser
);

// Resume upload
router.post(
  "/user/upload-resume",
  protect,
  (req, res, next) => {
    console.log(`📄 [AUTH] POST /user/upload-resume by user: ${req.user?.id}`);
    next();
  },
  resumeUpload.single("resume"),
  (req, res, next) => {
    console.log(
      "📁 [UPLOAD] Received resume:",
      req.file?.originalname || "No file"
    );
    next();
  },
  uploadResume
);

module.exports = router;

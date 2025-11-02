//server/routes/resumeRoutes.js
const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware.js");
const {
  uploadResume,
  getResumes,
  deleteResume,
  getResumeFile,
} = require("../controllers/resumeController.js");
const { resumeUpload } = require("../middleware/upload.js");

// GET /api/resume
router.get("/", protect, getResumes);

// POST /api/resume
router.post("/", protect, resumeUpload.single("resume"), uploadResume);

// DELETE /api/resume/:id
router.delete("/:id", protect, deleteResume);

router.get("/file/:id", protect, getResumeFile);

module.exports = router;

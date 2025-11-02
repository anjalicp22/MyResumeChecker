//server/controllers/resumeController.js
const Resume = require("../models/Resume.js");
// const User = require("../models/user.js");
const Skill = require("../models/Skill.js");
const { execFile } = require("child_process"); // Add at top
const path = require("path");
const fs = require("fs");
const mime = require("mime");

const uploadResume = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No resume file uploaded" });
    }

    const filePathForDB = `/uploads/resume/${req.file.filename}`;

    const resume = new Resume({
      user: req.user._id,
      filename: req.file.originalname,
      path: filePathForDB,
      uploadedAt: new Date(),
    });

    await resume.save();

    //  CALL PYTHON SKILL EXTRACTOR
    const resumeFullPath = path.join(
      __dirname,
      "..",
      "..",
      "uploads",
      "resume",
      req.file.filename
    );

    const extractorPath = path.join(__dirname, "..", "python", "extractor.py");

    execFile(
      "python",
      [extractorPath, resumeFullPath],
      async (error, stdout, stderr) => {
        if (error || jsonErr) {
          console.error("Extractor or parse error:", error || jsonErr);
          return res.status(200).json({
            message: "Resume uploaded, extraction failed. Please check logs.",
            resume,
            extractedSkills: [],
            extractionError: true,
            extractorStdErr: stderr || null,
          });
        }

        // const extractedSkills = JSON.parse(stdout); // ← assuming output is JSON list
        let extractedSkills = [];
        try {
          extractedSkills = JSON.parse(stdout || "[]");
        } catch (jsonErr) {
          console.error("JSON parse error:", jsonErr);
          return res.status(500).json({
            message: "Skill parsing failed",
            resume,
            extractedSkills: [],
            extractionError: true,
          });
        }

        try {
          //  Save skills to MongoDB
          await Skill.create({
            user: req.user._id,
            source: "resume",
            sourceRef: resume._id.toString(), // Correct reference
            skills: Array.isArray(extractedSkills)
              ? extractedSkills
              : [extractedSkills],
          });
        } catch (skillSaveErr) {
          console.error("Failed to save extracted skills to DB:", skillSaveErr);
          // Still return success for upload, but mark extraction error
          return res.status(200).json({
            message: "Resume uploaded, skill save failed. Check logs.",
            resume,
            extractedSkills,
            extractionError: true,
          });
        }

        return res.status(200).json({
          message: "Resume uploaded and skills extracted",
          resume,
          extractedSkills,
          extractionError: false,
        });
      }
    );
  } catch (error) {
    console.error("Resume upload error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const getResumes = async (req, res) => {
  try {
    const resumes = await Resume.find({ user: req.user._id }).sort({
      uploadedAt: -1,
    });
    res.json(resumes);
  } catch (error) {
    console.error("Failed to get resumes:", error);
    res.status(500).json({ message: "Failed to get resumes" });
  }
};

// Serve resume file from uploads/resume directory
const getResumeFile = async (req, res) => {
  try {
    // Expect the :id to be the resume document id or the filename depending on route usage.
    // This route assumes id is the Resume._id (string). If your client passes stored 'path' id/filename adapt accordingly.
    const resumeId = req.params.id;
    const resume = await Resume.findById(resumeId);
    if (!resume) {
      return res.status(404).json({ message: "Resume not found" });
    }

    // resume.path expected like '/uploads/resume/<filename>'
    const savedPath = resume.path || "";
    const filename = path.basename(savedPath);
    const absolutePath = path.join(
      __dirname,
      "..",
      "..",
      "uploads",
      "resume",
      filename
    );

    if (!fs.existsSync(absolutePath)) {
      return res.status(404).json({ message: "File not found on server" });
    }

    // set download headers
    const mimeType = mime.getType(absolutePath) || "application/octet-stream";
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${resume.filename}"`
    );
    res.setHeader("Content-Type", mimeType);

    return res.sendFile(absolutePath);
  } catch (err) {
    console.error("Failed to fetch resume file:", err);
    res.status(500).json({ message: "Failed to fetch resume" });
  }
};
// Delete resume doc, associated file and extracted skills
const deleteResume = async (req, res) => {
  try {
    const resume = await Resume.findById(req.params.id);
    if (!resume) {
      return res.status(404).json({ message: "Resume not found" });
    }
    if (resume.user.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ message: "Not authorized to delete this resume" });
    }
    // Remove file on disk if exists
    try {
      const savedPath = resume.path || "";
      const filename = path.basename(savedPath);
      const absolutePath = path.join(
        __dirname,
        "..",
        "..",
        "uploads",
        "resume",
        filename
      );
      if (fs.existsSync(absolutePath)) {
        fs.unlinkSync(absolutePath);
      }
    } catch (fsErr) {
      console.warn("Failed to delete resume file from disk:", fsErr);
      // proceed anyway — don't block deletion of DB records if file delete fails
    }

    // Delete resume doc
    await Resume.findByIdAndDelete(resume._id);

    // Remove related Skill documents
    try {
      await Skill.deleteMany({
        source: "resume",
        sourceRef: resume._id.toString(),
      });
    } catch (skillDelErr) {
      console.warn("Failed to delete related Skill docs:", skillDelErr);
    }

    res.json({ message: "Resume deleted" });
  } catch (error) {
    console.error("Failed to delete resume:", error);
    res.status(500).json({ message: "Failed to delete resume" });
  }
};

module.exports = {
  uploadResume,
  getResumes,
  deleteResume,
  getResumeFile,
};

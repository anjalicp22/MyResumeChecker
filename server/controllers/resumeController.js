//server/controllers/resumeController.js
const Resume = require("../models/Resume.js");
const User = require("../models/user.js");
const Skill = require("../models/Skill.js");
const { execFile } = require("child_process"); // Add at top
const path = require("path");

const uploadResume = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No resume file uploaded" });
    }

    const filePath = `/uploads/resume/${req.file.filename}`;

    const resume = new Resume({
      user: req.user._id,
      filename: req.file.originalname,
      path: filePath,
      uploadedAt: new Date(),
    });

    await resume.save();

    // 🧠 CALL PYTHON SKILL EXTRACTOR
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
          });
        }

        // const extractedSkills = JSON.parse(stdout); // ← assuming output is JSON list
        let extractedSkills = [];
        try {
          extractedSkills = JSON.parse(stdout);
        } catch (jsonErr) {
          console.error("JSON parse error:", jsonErr);
          return res.status(500).json({ message: "Skill parsing failed" });
        }
        // 🧠 Save skills to MongoDB
        await Skill.create({
          user: req.user._id,
          source: "resume",
          sourceRef: resume._id.toString(), // Correct reference
          skills: extractedSkills,
        });

        return res.status(200).json({
          message: "Resume uploaded and skills extracted",
          resume,
          extractedSkills,
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
    const resumes = await Resume.find({ user: req.user._id });
    res.json(resumes);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to get resumes" });
  }
};

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
    // Use findByIdAndDelete or deleteOne instead of remove()
    await Resume.findByIdAndDelete(resume._id);
    res.json({ message: "Resume deleted" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to delete resume" });
  }
};

module.exports = { uploadResume, getResumes, deleteResume };

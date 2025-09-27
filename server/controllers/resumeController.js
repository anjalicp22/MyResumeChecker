//server/controllers/resumeController.js
const Resume = require("../models/Resume.js");
const User = require("../models/user.js");
const Skill = require("../models/Skill.js");
const { execFile } = require("child_process"); // Add at top
const path = require("path");
const fs = require("fs");
const { Pool } = require("pg");

// PostgreSQL connection
const pool = new Pool({ connectionString: process.env.POSTGRES_URI });

// Ensure resume upload directory exists
const resumeUploadDir = path.join(__dirname, "..", "..", "uploads", "resume");
if (!fs.existsSync(resumeUploadDir)) {
  fs.mkdirSync(resumeUploadDir, { recursive: true });
}

const uploadResume = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No resume file uploaded" });
    }

    // const filePath = `/uploads/resume/${req.file.filename}`;

    const { originalname, buffer } = req.file;

    // 1️⃣ Save file to PostgreSQL (BYTEA)
    let pgResumeId;
    try {
      const pgResult = await pool.query(
        "INSERT INTO resumes(filename, content, user_id) VALUES($1, $2, $3) RETURNING id",
        [originalname, buffer, req.user._id.toString()]
      );
      pgResumeId = pgResult.rows[0].id;
    } catch (err) {
      console.error("PostgreSQL insert failed:", err);
      return res
        .status(500)
        .json({ message: "Failed to save resume in PostgreSQL" });
    }

    // 2️⃣ Save MongoDB record, storing PostgreSQL ID as path
    const resume = new Resume({
      user: req.user._id,
      filename: originalname,
      path: pgResumeId.toString(), // store PostgreSQL ID here
      uploadedAt: new Date(),
    });
    await resume.save();

    // const resume = new Resume({
    //   user: req.user._id,
    //   filename: req.file.originalname,
    //   path: filePath,
    //   uploadedAt: new Date(),
    // });

    // await resume.save();

    //     //  CALL PYTHON SKILL EXTRACTOR
    //     const resumeFullPath = path.join(
    //       __dirname,
    //       "..",
    //       "..",
    //       "uploads",
    //       "resume",
    //       req.file.filename
    //     );

    //     const extractorPath = path.join(__dirname, "..", "python", "extractor.py");

    //     execFile(
    //       "python",
    //       [extractorPath, resumeFullPath],
    //       async (error, stdout, stderr) => {
    //         if (error || jsonErr) {
    //           console.error("Extractor or parse error:", error || jsonErr);
    //           return res.status(200).json({
    //             message: "Resume uploaded, extraction failed. Please check logs.",
    //             resume,
    //             extractedSkills: [],
    //             extractionError: true,
    //           });
    //         }

    //         // const extractedSkills = JSON.parse(stdout); // ← assuming output is JSON list
    //         let extractedSkills = [];
    //         try {
    //           extractedSkills = JSON.parse(stdout);
    //         } catch (jsonErr) {
    //           console.error("JSON parse error:", jsonErr);
    //           return res.status(500).json({ message: "Skill parsing failed" });
    //         }
    //         //  Save skills to MongoDB
    //         await Skill.create({
    //           user: req.user._id,
    //           source: "resume",
    //           sourceRef: resume._id.toString(), // Correct reference
    //           skills: extractedSkills,
    //         });

    //         return res.status(200).json({
    //           message: "Resume uploaded and skills extracted",
    //           resume,
    //           extractedSkills,
    //         });
    //       }
    //     );
    //   } catch (error) {
    //     console.error("Resume upload error:", error);
    //     res.status(500).json({ message: "Server error" });
    //   }
    // };
    // 3️⃣ Create temp file for Python extractor
    const tempPath = path.join(
      resumeUploadDir,
      `${pgResumeId}_${originalname}`
    );
    fs.writeFileSync(tempPath, buffer);

    const extractorPath = path.join(__dirname, "..", "python", "extractor.py");

    // 4️⃣ Call Python extractor
    execFile(
      "python",
      [extractorPath, tempPath],
      async (error, stdout, stderr) => {
        fs.unlinkSync(tempPath); // clean up temp file

        if (error) {
          console.error("Extractor error:", error);
          return res.status(200).json({
            message: "Resume uploaded, extraction failed. Check logs.",
            resume,
            extractedSkills: [],
            extractionError: true,
          });
        }

        let extractedSkills = [];
        try {
          extractedSkills = JSON.parse(stdout);
        } catch (jsonErr) {
          console.error("JSON parse error:", jsonErr);
          return res.status(500).json({ message: "Skill parsing failed" });
        }

        // 5️⃣ Save extracted skills to MongoDB
        await Skill.create({
          user: req.user._id,
          source: "resume",
          sourceRef: resume._id.toString(),
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

// Get resume file from PostgreSQL by ID
const getResumeFile = async (req, res) => {
  const resumeId = parseInt(req.params.id);
  try {
    const result = await pool.query(
      "SELECT filename, content FROM resumes WHERE id=$1",
      [resumeId]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Resume not found" });
    }

    const { filename, content } = result.rows[0];

    // Set headers for download
    res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);

    // Set content type (assuming PDF, change if needed)
    res.setHeader("Content-Type", "application/pdf");

    res.send(content);
  } catch (err) {
    console.error("Failed to fetch resume file:", err);
    res.status(500).json({ message: "Failed to fetch resume" });
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

    // Delete from PostgreSQL
    await pool.query("DELETE FROM resumes WHERE id=$1", [
      parseInt(resume.path),
    ]);

    res.json({ message: "Resume deleted" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to delete resume" });
  }
};

module.exports = {
  uploadResume,
  getResumes,
  deleteResume,
  getResumeFile,
};

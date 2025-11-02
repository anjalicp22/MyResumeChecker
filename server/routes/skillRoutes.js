// server/routes/skillRoutes.js

const express = require("express");
const router = express.Router();
const {
  getSkills,
  addSkill,
  deleteSkill,
  saveAnalyzedSkills,
  getSkillFrequencyAgg,
  gapAnalysis,
} = require("../controllers/skillController.js");
const { protect } = require("../middleware/authMiddleware.js");
const Skill = require("../models/Skill.js");

router.route("/").get(protect, getSkills).post(protect, addSkill);

router.get("/resume/:resumeId", protect, async (req, res) => {
  try {
    const { resumeId } = req.params;
    const skillDocs = await Skill.find({
      user: req.user._id,
      source: "resume",
      sourceRef: resumeId,
    }).sort({ isSuggested: 1 });

    if (!skillDocs.length)
      return res.status(404).json({ message: "No skills found", skills: [] });

    res.json({
      existing_skills: skillDocs
        .filter((doc) => !doc.isSuggested)
        .flatMap((doc) => doc.skills),
      suggested_skills: skillDocs
        .filter((doc) => doc.isSuggested)
        .flatMap((doc) => doc.skills),
    });
  } catch (err) {
    console.error("[SkillRoutes] Fetch skills by resume failed:", err);
    res.status(500).json({ message: "Server error fetching resume skills" });
  }
});

// New route to save skills from analyzed resume
router.route("/analyze").post(protect, saveAnalyzedSkills);

router.route("/frequency").get(protect, getSkillFrequencyAgg);

router.route("/gap").get(protect, gapAnalysis);

router.route("/:id").delete(protect, deleteSkill);

module.exports = router;

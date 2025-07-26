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

router.route("/").get(protect, getSkills).post(protect, addSkill);

// New route to save skills from analyzed resume
router.route("/analyze").post(protect, saveAnalyzedSkills);

router.route("/frequency").get(protect, getSkillFrequencyAgg);

router.route("/gap").get(protect, gapAnalysis);

router.route("/:id").delete(protect, deleteSkill);

module.exports = router;

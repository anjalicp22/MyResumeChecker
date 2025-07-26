// server/controllers/skillController.js
const Skill = require("../models/Skill.js");
const Application = require("../models/Application.js");

// Simple server-side normalizer (mirrors client)
const normalize = (s) =>
  s
    .toLowerCase()
    .replace(/[^a-z0-9.+#]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

const normalizeArray = (arr = []) => [...new Set(arr.map(normalize))];

const getSkills = async (req, res) => {
  console.log("📥 [GET] /api/skills", req.query);
  const query = { user: req.user._id };
  if (req.query.source) query.source = req.query.source;
  if (req.query.ref) query.sourceRef = req.query.ref;

  const skills = await Skill.find(query).sort({ isSuggested: 1 });
  res.json(skills);
};

const addSkill = async (req, res) => {
  const { skills, source, sourceRef } = req.body;

  if (!Array.isArray(skills) || skills.length === 0) {
    return res.status(400).json({ message: "No skills provided" });
  }

  const norm = normalizeArray(skills);

  const newSkill = new Skill({
    user: req.user._id,
    skills: norm,
    source,
    sourceRef,
  });

  await newSkill.save();
  res.status(201).json(newSkill);
};

// Save analyzed skills from resume (FIXED)
const saveAnalyzedSkills = async (req, res) => {
  const { resumeId, existing_skills = [], suggested_skills = [] } = req.body;

  if (!resumeId || !Array.isArray(existing_skills)) {
    return res.status(400).json({ message: "Missing resumeId or skills." });
  }

  console.log("🧠 [saveAnalyzedSkills] existing:", existing_skills);
  console.log("🔮 [saveAnalyzedSkills] suggested:", suggested_skills);

  const normExisting = normalizeArray(existing_skills);
  const normSuggested = normalizeArray(suggested_skills);

  await Skill.deleteMany({
    user: req.user._id,
    source: "resume",
    sourceRef: resumeId,
  });

  const skillDocs = [];

  if (normExisting.length) {
    skillDocs.push({
      user: req.user._id,
      source: "resume",
      sourceRef: resumeId,
      skills: normExisting,
      isSuggested: false,
    });
  }

  if (normSuggested.length) {
    skillDocs.push({
      user: req.user._id,
      source: "resume",
      sourceRef: resumeId,
      skills: normSuggested,
      isSuggested: true,
    });
  }

  if (skillDocs.length) {
    await Skill.insertMany(skillDocs);
  }

  res.status(201).json({ message: "Skills saved successfully" });
};

const deleteSkill = async (req, res) => {
  await Skill.findByIdAndDelete(req.params.id);
  res.json({ message: "Skill deleted" });
};

// 🔝 Frequency aggregation
const getSkillFrequencyAgg = async (req, res) => {
  console.log("📊 [GET] /api/skills/frequency");
  const userId = req.user._id;

  const data = await Skill.aggregate([
    { $match: { user: userId } },
    { $unwind: "$skills" },
    { $group: { _id: "$skills", count: { $sum: 1 } } },
    { $sort: { count: -1 } },
    { $limit: 10 },
  ]);

  res.json(data);
};

// (Optional) 🔎 Compute the gap server-side
const gapAnalysis = async (req, res) => {
  const { resumeId, applicationId } = req.query;
  console.log("🧠 [GET] /api/skills/gap", { resumeId, applicationId });

  if (!resumeId || !applicationId)
    return res
      .status(400)
      .json({ message: "resumeId and applicationId required" });

  const resumeSkillsDoc = await Skill.findOne({
    user: req.user._id,
    source: "resume",
    sourceRef: resumeId,
    isSuggested: false,
  });

  const app = await Application.findOne({
    _id: applicationId,
    user: req.user._id,
  });

  const existing = new Set(normalizeArray(resumeSkillsDoc?.skills || []));
  const required = normalizeArray(app?.analysisResult?.required_skills || []);
  const missing = required.filter((s) => !existing.has(s));

  res.json({
    existing: [...existing],
    required,
    missing,
    matched: required.length - missing.length,
    missingCount: missing.length,
  });
};

module.exports = {
  getSkills,
  addSkill,
  deleteSkill,
  saveAnalyzedSkills,
  getSkillFrequencyAgg,
  gapAnalysis,
};

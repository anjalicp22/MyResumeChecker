// server\controllers\applicationController.js

const Application = require("../models/Application.js");
const Skill = require("../models/Skill.js");
// const { spawn } = require("child_process");
const path = require("path");
const axios = require("axios");

const FASTAPI_URL =
  process.env.FASTAPI_URL || "https://your-fastapi-service-url.com";

const getApplications = async (req, res) => {
  const applications = await Application.find({ user: req.user._id });
  res.json(applications);
};

const createApplication = async (req, res) => {
  try {
    const newApp = await Application.create({
      ...req.body,
      analysisResult: req.body.analysisResult || null,
      resumeUsed: req.body.resumeUsed || null,
      user: req.user._id,
    });

    const jobDescText = req.body.jobDescription;
    let jdSkills = [];
    let extractionError = false;
    try {
      const response = await axios.post(
        `${FASTAPI_URL}/analyze-job-description`,
        { text: jobDescText },
        { timeout: 60000 }
      );

      if (response?.data) {
        const { existing_skills, suggested_skills } = response.data;
        jdSkills = [...(existing_skills || []), ...(suggested_skills || [])];
      }
    } catch (apiErr) {
      console.error(
        "FastAPI job description extraction failed:",
        apiErr.message
      );
      extractionError = true;
    }
    try {
      await Skill.create({
        user: req.user._id,
        source: "job_description",
        sourceRef: newApp._id.toString(),
        skills: jdSkills,
      });
    } catch (skillErr) {
      console.error("Failed to save JD skills to DB:", skillErr);
      extractionError = true;
    }

    return res.status(201).json({
      message: extractionError
        ? "Application saved, but skill extraction failed"
        : "Application saved and skills extracted",
      application: newApp,
      jdSkills,
      extractionError,
    });
  } catch (err) {
    console.error("Create application error:", err);
    res.status(500).json({ message: "Failed to save application" });
  }
};

const updateApplication = async (req, res) => {
  const updatedApp = await Application.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );
  res.json(updatedApp);
};

const deleteApplication = async (req, res) => {
  await Application.findByIdAndDelete(req.params.id);
  res.json({ message: "Application deleted" });
};

module.exports = {
  getApplications,
  createApplication,
  updateApplication,
  deleteApplication,
};

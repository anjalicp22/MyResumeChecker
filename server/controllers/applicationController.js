// server\controllers\applicationController.js

const Application = require("../models/Application.js");
const Skill = require("../models/Skill.js");
const { spawn } = require("child_process");
const path = require("path");

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

    const py = spawn("python", [path.resolve(__dirname, "../extractor.py")]);

    let stdout = "";
    let stderr = "";

    py.stdout.on("data", (data) => (stdout += data.toString()));
    py.stderr.on("data", (data) => (stderr += data.toString()));

    py.on("close", async (code) => {
      let jdSkills = [];
      let extractionError = false;

      if (code !== 0) {
        console.error("JD skill extraction failed:", stderr);
        extractionError = true;
      } else {
        try {
          jdSkills = JSON.parse(stdout);
          await Skill.create({
            user: req.user._id,
            source: "job_description",
            sourceRef: newApp._id.toString(),
            skills: jdSkills,
          });
        } catch (err) {
          console.error("Skill JSON parse error:", err);
          extractionError = true;
        }
      }

      return res.status(201).json({
        message: extractionError
          ? "Application saved, but skill extraction failed"
          : "Application saved and skills extracted",
        application: newApp,
        jdSkills,
        extractionError,
      });
    });

    py.stdin.write(jobDescText);
    py.stdin.end();
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

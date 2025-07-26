// server\models\Application.js
const mongoose = require("mongoose");

const applicationSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    title: String,
    experience: String,
    location: String,
    jobDescription: String,
    lastDate: String,
    portal: String,
    interviewProcess: String,
    interviewDate: String,
    analysisResult: {
      required_skills: [String],
      missing_skills: [String],
    },
    resumeUsed: String, // filename or resume ID
    status: {
      type: String,
      enum: ["Applied", "Interview Scheduled", "Rejected", "Offer Received"],
      default: "Applied",
    },
  },
  {
    timestamps: true,
    collection: "applications", // Explicitly define collection name if needed
  }
);

module.exports = mongoose.model("Application", applicationSchema);

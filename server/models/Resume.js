//server/Resume.js
const mongoose = require("mongoose");

const resumeSchema = new mongoose.Schema(
  {
    filename: String,
    path: String,
    uploadedAt: { type: Date, default: Date.now },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Resume", resumeSchema);

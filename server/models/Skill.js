// server/models/Skill.js
const mongoose = require("mongoose");

const skillSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    source: {
      type: String,
      enum: ["resume", "job_description"],
      required: true,
    },
    sourceRef: { type: String },
    skills: [String],
    isSuggested: { type: Boolean, default: false }, // 🔧 ADD THIS
    createdAt: { type: Date, default: Date.now },
  },
  { collection: "skills" }
);

module.exports = mongoose.model("Skill", skillSchema);

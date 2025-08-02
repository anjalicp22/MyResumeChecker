//server\server.js

const dotenv = require("dotenv");
// const mongoose = require("mongoose");
dotenv.config();

const fs = require("fs");
const path = require("path");

const app = require("./app.js");
const connectDB = require("./config/db.js");

if (!process.env.MONGO_URI) {
  console.error("MONGO_URI not defined in .env");
  process.exit(1);
}

const PORT = process.env.PORT || 5000;

const uploadDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
  console.log("Created uploads folder");
}

const profileUploadDir = path.join(uploadDir, "profile");
if (!fs.existsSync(profileUploadDir)) {
  fs.mkdirSync(profileUploadDir, { recursive: true });
  console.log("Created uploads/profile folder");
}

connectDB()
  .then(() => {
    console.log("Connected to MongoDB");

    app.listen(PORT, "0.0.0.0", () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Server failed to start due to DB connection:", err);
    process.exit(1);
  });

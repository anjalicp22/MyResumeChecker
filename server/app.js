//app.js
const express = require("express");
const cors = require("cors");
const app = express();
const path = require("path");

// Route files
const authRoutes = require("./routes/authRoutes.js");
const applicationRoutes = require("./routes/applicationRoutes.js");
const resumeRoutes = require("./routes/resumeRoutes.js");
const skillRoutes = require("./routes/skillRoutes.js");
const taskRoutes = require("./routes/taskRoutes.js");
const userRoutes = require("./routes/userRoutes.js");
const errorHandler = require("./middleware/errorHandler.js");

// Enable CORS
app.use(
  cors({
    origin: "http://localhost:3000",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true,
  })
);
app.options("*", cors());

// Parse incoming requests
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // Handles form-data (except file uploads)

// Serve static files for profile pictures
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
console.log("Serving static files from:", path.join(__dirname, "uploads"));

// Mount API routes *after* middleware is in place
app.use("/api/user", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/applications", applicationRoutes);
app.use("/api/resume", resumeRoutes);
app.use("/api/skills", skillRoutes);
app.use("/api/tasks", taskRoutes);

// Root test
app.get("/", (req, res) => {
  res.send("Express server is working");
});

// Error handler
app.use(errorHandler);

module.exports = app;

//server\app.js

const express = require("express");
const cors = require("cors");
const path = require("path");

const app = express();

// Route files
const authRoutes = require("./routes/authRoutes.js");
const applicationRoutes = require("./routes/applicationRoutes.js");
const resumeRoutes = require("./routes/resumeRoutes.js");
const skillRoutes = require("./routes/skillRoutes.js");
const taskRoutes = require("./routes/taskRoutes.js");
const userRoutes = require("./routes/userRoutes.js");
const errorHandler = require("./middleware/errorHandler.js");

//  Allowed origins (local + Render frontend)
const allowedOrigins = [
  "http://localhost:3000",
  "https://myresumechecker.onrender.com",
];

//  Enable CORS
app.use(
  cors({
    origin: function (origin, callback) {
      // allow requests with no origin (like curl or Postman)
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      } else {
        return callback(new Error("Not allowed by CORS"));
      }
    },
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true,
  })
);
app.options("*", cors());

//  Parse incoming JSON & URL-encoded form data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//  Serve static files (profile pics, etc.)
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
console.log("Serving static files from:", path.join(__dirname, "uploads"));

//  Mount API routes
app.use("/api/user", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/applications", applicationRoutes);
app.use("/api/resume", resumeRoutes);
app.use("/api/skills", skillRoutes);
app.use("/api/tasks", taskRoutes);

//  Test root
app.get("/", (req, res) => {
  res.send("Express server is working");
});

//  Global error handler
app.use(errorHandler);

module.exports = app;

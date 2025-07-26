//controllers/authController.js
const User = require("../models/user.js");
const generateToken = require("../utils/token.js");
const bcrypt = require("bcryptjs");
const path = require("path");
const fs = require("fs");

// Register new user
const registerUser = async (req, res) => {
  const { name, email, password } = req.body;
  const emailLower = email.toLowerCase();

  // Check if user exists
  const userExists = await User.findOne({ email: emailLower });

  if (userExists) {
    console.log("Register failed: User already exists:", emailLower);
    return res.status(400).json({ message: "User already exists" });
  }

  const user = await User.create({
    name,
    email: emailLower,
    password,
  }); // Schema pre-save hook will hash it

  if (user) {
    console.log("User registered:", user.email);
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      profilePicture: user.profilePicture,
      token: generateToken(user._id),
    });
  } else {
    console.error("User creation failed");
    res.status(400).json({ message: "Invalid user data" });
  }
};

// Login user
const loginUser = async (req, res) => {
  const { email, password } = req.body;
  const emailLower = email.toLowerCase();

  console.log("Login attempt:", emailLower);

  const user = await User.findOne({ email: emailLower });
  if (!user) {
    console.log("User not found for email:", emailLower);
    return res.status(401).json({ message: "User not found" });
  }

  console.log("Entered password:", password);
  console.log("Stored hashed password:", user.password);

  try {
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.log("Incorrect password for user:", emailLower);
      return res.status(401).json({ message: "Incorrect password" });
    }
  } catch (error) {
    console.error("Error comparing passwords:", error);
    return res.status(500).json({ message: "Server error" });
  }

  console.log("User logged in:", user.email);
  res.json({
    _id: user._id,
    name: user.name,
    email: user.email,
    profilePicture: user.profilePicture,
    token: generateToken(user._id),
  });
};

// Get profile
const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    if (user) {
      console.log("Fetched profile for user:", user.email);
      res.json(user);
    } else {
      console.log("User profile not found");
      res.status(404).json({ message: "User not found" });
    }
  } catch (err) {
    console.error("Error fetching profile:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// Update profile
const updateUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      console.log("User not found during profile update");
      return res.status(404).json({ message: "User not found" });
    }

    const { name, email, password } = req.body;

    if (name) user.name = name;
    if (email) user.email = email;
    if (password) user.password = password; // Will re-hash on save

    await user.save();
    console.log("Updated profile for user:", user.email);

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id),
    });
  } catch (err) {
    console.error("Error updating profile:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// Upload profile picture
const uploadProfilePicture = async (req, res) => {
  if (!req.file) {
    console.warn("No profile picture uploaded");
    return res.status(400).json({ message: "No file uploaded" });
  }

  console.log("Uploaded profile file details:", req.file);

  const filePath = `/uploads/profile/${req.file.filename}`;

  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      console.log("User not found during profile picture upload");
      return res.status(404).json({ message: "User not found" });
    }

    // Delete old profile picture if it exists
    if (user.profilePicture) {
      const oldPath = path.join(__dirname, "..", user.profilePicture);
      if (fs.existsSync(oldPath)) {
        fs.unlinkSync(oldPath);
        console.log("Deleted old profile picture:", oldPath);
      }
    }

    user.profilePicture = filePath;
    await user.save();

    console.log("Profile picture saved at:", filePath);
    res.json({ message: "Profile picture updated", profilePicture: filePath });
  } catch (error) {
    console.error("Profile picture upload error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
  uploadProfilePicture,
};

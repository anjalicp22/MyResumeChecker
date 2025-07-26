// routes/userRoutes.js
const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const { protect } = require("../middleware/authMiddleware.js");
// const bcrypt = require("bcryptjs");
const fs = require("fs");
const path = require("path");
const { profileUpload } = require("../middleware/upload.js");
const generateToken = require("../utils/token.js");

router.put(
  "/profile",
  protect,
  profileUpload.single("profilePicture"),
  async (req, res) => {
    try {
      const user = await User.findById(req.user.id);
      if (!user) return res.status(404).json({ message: "User not found" });

      const { name, email, password } = req.body;

      if (name) user.name = name;
      if (email) user.email = email;
      if (password) user.password = password;

      if (req.file) {
        // Delete old image
        if (user.profilePicture) {
          const oldPath = path.join(__dirname, "..", user.profilePicture);
          try {
            if (fs.existsSync(oldPath)) {
              fs.unlinkSync(oldPath);
            }
          } catch (err) {
            console.warn("⚠️ Failed to delete old profile image:", err.message);
          }
        }

        // Save new path
        user.profilePicture = `/uploads/profile/${req.file.filename}`;
      }

      await user.save();

      res.json({
        id: user._id,
        name: user.name,
        email: user.email,
        profilePicture: user.profilePicture,
        token: generateToken(user._id),
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Server error" });
    }
  }
);

router.get("/profile", protect, async (req, res) => {
  const user = await User.findById(req.user.id).select("-password");
  if (!user) return res.status(404).json({ message: "User not found" });
  res.json(user);
});

module.exports = router;

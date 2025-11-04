//server/middleware/authMiddleware.js
const jwt = require("jsonwebtoken");
const User = require("../models/user.js");

const protect = async (req, res, next) => {
  // let token;

  // if (
  //   req.headers.authorization &&
  //   req.headers.authorization.startsWith("Bearer ")
  // ) {
  //   token = req.headers.authorization.split(" ")[1];

  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Not authorized, no token" });
  }

  const token = authHeader.split(" ")[1];

  if (!token || token.split(".").length !== 3) {
    return res.status(401).json({ message: "Token is malformed" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select("-password");

    if (!req.user) {
      return res.status(401).json({ message: "User not found" });
    }

    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      console.warn("JWT expired for request:", req.originalUrl);
      return res.status(401).json({ message: "TokenExpired" });
    }
    console.error("JWT verify failed:", error.message);
    res.status(401).json({ message: "Not authorized, token failed" });
  }
};

module.exports = { protect };

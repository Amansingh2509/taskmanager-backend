const jwt = require("jsonwebtoken");

// Fallback secret for development - must match authcontroller.js
const JWT_SECRET =
  process.env.JWT_SECRET || "your-super-secret-key-change-in-production";

module.exports = (req, res, next) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");
  if (!token)
    return res.status(401).json({ message: "No token, authorization denied" });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded; // user info attach
    next();
  } catch (error) {
    res.status(401).json({ message: "Token is not valid" });
  }
};

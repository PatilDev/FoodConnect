const jwt = require("jsonwebtoken");
const secret = process.env.JWT_SECRET || "mysecret";

// ✅ Generate token
const generateToken = (userId) => {
  return jwt.sign(
    { id: userId },       // 👈 wrapped in an object
    secret,               // 👈 use secret consistently
    { expiresIn: "7d" }
  );
};

// ✅ Decode token
const getUserIdFromToken = (token) => {
  try {
    const decoded = jwt.verify(token, secret);
    return decoded.id;     // 👈 will now return userId
  } catch (err) {
    throw new Error("Invalid or expired token");
  }
};

module.exports = { generateToken, getUserIdFromToken };

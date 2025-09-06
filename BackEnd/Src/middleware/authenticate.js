const { getUserIdFromToken } = require("../config/jwtProvider");
const userService = require("../service/userService");

const authenticate = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1]; // 👈 take Bearer token

    if (!token) {
      return res.status(401).json({ message: "No token provided" });
    }

    // ✅ verify token and get user
    const userId = getUserIdFromToken(token);
    const user = await userService.findUserById(userId);

    if (!user) {
      return res.status(401).json({ message: "Invalid token" });
    }

    req.user = user; // 👈 authenticated user available to routes
    next();
  } catch (error) {
    return res.status(401).json({ error: error.message });
  }
};

module.exports =authenticate;

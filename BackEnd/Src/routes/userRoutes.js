const express = require("express");
const authenticate = require("../middleware/authenticate"); // make sure path is correct

const router = express.Router();

// Get current user profile
router.get("/me", authenticate, (req, res) => {
  res.json(req.user); 
});

module.exports = router;

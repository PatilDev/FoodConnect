const bcrypt = require("bcrypt");
const { generateToken } = require("../config/jwtProvider.js");
const userService = require("../service/userService.js");

const register = async (req, res) => {
  try {
    const user = await userService.createUser(req.body);
    const token = generateToken(user._id);

    return res.status(201).send({
      token,
      user: { _id: user._id, fullName: user.fullName, email: user.email, role: user.role },
      message: "Register Successful"
    });
  } catch (error) {
    return res.status(500).send({ error: error.message });
  }
};

const login = async (req, res) => {
  const { password, email } = req.body;
  try {
    const user = await userService.getUserByEmail(email);
    if (!user) return res.status(404).send({ message: "User not found" });

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).send({ message: "Invalid password" });
    }

    const token = generateToken(user._id);

    return res.status(200).send({
      token,
      user: { _id: user._id, fullName: user.fullName, email: user.email, role: user.role },
      message: "Login Successful"
    });
  } catch (error) {
    return res.status(500).send({ error: error.message });
  }
};

module.exports = { register, login };

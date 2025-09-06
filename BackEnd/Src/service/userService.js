const bcrypt = require("bcrypt");
const User = require("../models/userModel");
const { getUserIdFromToken } = require("../config/jwtProvider");

module.exports = {
  // -------------------------------------------------------
  // Create new user
  async createUser(userData) {
    try {

      let { fullName, email, password, role } = userData;
      // check if user already exists
      const isUserExist = await User.findOne({ email });
      if (isUserExist) {
        throw new Error("User Already Exists with this Email " + email);
      }

      // ✅ hash password (now allowed since we used let)
      password = await bcrypt.hash(password, 8);

      // create user
      const user = await User.create({
        fullName,
        email,
        password,
        role,
      });

      return user; // ✅ return the created user
    } catch (error) {
      throw new Error(error.message);
    }
  },

  // -------------------------------------------------------
  // Get user by email
  async getUserByEmail(email) {
    try {
      const user = await User.findOne({ email });
      if (!user) {
        throw new Error("User Not Found with " + email);
      }
      return user; // ✅ return user
    } catch (error) {
      throw new Error(error.message);
    }
  },

  // -------------------------------------------------------
  // Find user by ID
  async findUserById(userId) {
    try {
      const user = await User.findById(userId).populate("addresses");
      if (!user) {
        throw new Error("User Not Found with " + userId+"\n"+user.email);
      }
      return user;
    } catch (error) {
      throw new Error(error.message);
    }
  },

  // -------------------------------------------------------
  // Find user profile by JWT
  async findUserProfileByJwt(jwt) {
    try {
      const userid = getUserIdFromToken(jwt); // ✅ fixed typo
      const user = await this.findUserById(userid);
      return user;
    } catch (error) {
      throw new Error(error.message);
    }
  },

  // -------------------------------------------------------
  // Get all users
  async findAllUsers() {
    try {
      const users = await User.find();
      return users;
    } catch (error) {
      throw new Error(error.message);
    }
  },
};

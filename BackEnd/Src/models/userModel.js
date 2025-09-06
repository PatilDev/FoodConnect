const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  email:    { type: String, required: true, unique: true },
  password: { type: String, required: true },

  role: {
    type: String,
    enum: ["ROLE_CUSTOMER", "ROLE_RESTAURANT_OWNER","ROLE_DELIVERY_BOY"],
    default: "ROLE_CUSTOMER",
  },

  orders: [{ type: mongoose.Schema.Types.ObjectId, ref: "Order" }],

  favorites: [{ name: String, description: String, images: [String] }],

  addresses: [{ type: mongoose.Schema.Types.ObjectId, ref: "Address" }],
});

const User = mongoose.model("User", UserSchema);
module.exports = User;

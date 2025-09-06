const mongoose = require("mongoose");

const FoodSchema = new mongoose.Schema({
    addressId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Address",
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  
  foodName: { type: String, required: true },
  restaurantDetails: {
    restaurantName: { type: String, required: true },
    description: { type: String, required: true },
  },
  foodImage: {
    data: Buffer,
    contentType: String,
  },
foodPrice: { type: Number, required: true },});

const Food = mongoose.model("Food", FoodSchema);
module.exports = Food;

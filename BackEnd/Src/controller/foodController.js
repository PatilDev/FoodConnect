const Food = require("../models/foodModel");
const Address = require("../models/addressModel");

exports.addFoodData = async (req, res) => {
  try {
    const { addressId, foodName, restaurantDetails, foodPrice } = req.body;

    const address = await Address.findById(addressId).populate("userId", "_id");
    if (!address) {
      return res.status(404).json({ message: "Address not found" });
    }

    // handle both stringified JSON and object
    let parsedDetails = restaurantDetails;
    if (typeof restaurantDetails === "string") {
      parsedDetails = JSON.parse(restaurantDetails);
    }

    const foodData = await Food.create({
      addressId,
      userId: address.userId._id,
      foodName,
      restaurantDetails: parsedDetails,
      foodImage: req.file
        ? { data: req.file.buffer, contentType: req.file.mimetype }
        : undefined,
      foodPrice, // ✅ correct name
    });

    res.status(201).json({
      food: foodData,
      address,
    });
  } catch (err) {
    console.error("❌ Error To Add new Food:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

exports.getFoods = async (req, res) => {
  try {
    const foods = await Food.find()
      .populate("addressId")
      .populate("userId", "name email");

    const foodsWithImage = foods.map(food => {
      const obj = food.toObject();
      if (food.foodImage?.data) {
        obj.foodImage = `data:${food.foodImage.contentType};base64,${food.foodImage.data.toString("base64")}`;
      } else {
        obj.foodImage = null;
      }
      return obj;
    });

    res.status(200).json(foodsWithImage);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};



exports.getFoodsByUserId = async (req, res) => {
  try {
    const { userId } = req.params;

    const foods = await Food.find({ userId })
      .populate("addressId")
      .populate("userId", "name email");

    if (!foods || foods.length === 0) {
      return res.status(404).json({ message: "No foods found for this user" });
    }

    const foodsWithImage = foods.map(food => {
      const obj = food.toObject();
      if (food.foodImage?.data) {
        obj.foodImage = `data:${food.foodImage.contentType};base64,${food.foodImage.data.toString("base64")}`;
      } else {
        obj.foodImage = null;
      }
      return obj;
    });

    res.status(200).json(foodsWithImage);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};


exports.updateFood = async (req, res) => {
  try {
    const { id } = req.params;
    const { addressId, foodName, restaurantDetails ,foodPrise} = req.body;

    let updateData = { foodName, restaurantDetails,foodPrise };

    if (req.file) {
      updateData.foodImage = {
        data: req.file.buffer,
        contentType: req.file.mimetype,
      };
    }

    if (addressId) {
      const address = await Address.findById(addressId);
      if (!address) {
        return res.status(404).json({ message: "Address not found" });
      }
      updateData.addressId = addressId;
      updateData.userId = address.userId;
    }

    const updatedFood = await Food.findByIdAndUpdate(id, updateData, { new: true })
      .populate("addressId");

    if (!updatedFood) {
      return res.status(404).json({ message: "Food not found" });
    }

    res.status(200).json({
      message: "✅ Food updated successfully",
      food: updatedFood,
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

exports.getFoodImage = async (req, res) => {
  try {
    const { id } = req.params;
    const food = await Food.findById(id);

    if (!food || !food.foodImage?.data) {
      return res.status(404).json({ message: "Image not found" });
    }

    res.set("Content-Type", food.foodImage.contentType);
    res.send(food.foodImage.data);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

exports.deleteFood = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedFood = await Food.findByIdAndDelete(id);

    if (!deletedFood) {
      return res.status(404).json({ message: "Food not found" });
    }

    res.status(200).json({ message: "🗑️ Food deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

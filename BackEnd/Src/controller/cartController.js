// controllers/cartController.js
const Cart = require("../models/cartModel");
const Food = require("../models/foodModel");

// ✅ Get user cart
exports.getCart = async (req, res) => {
  try {
const { userId } = req.body || req.query;
    if (!userId) return res.status(400).json({ message: "userId required" });

    const cart = await Cart.findOne({ userId }).populate("items.foodId");
    if (!cart) return res.status(200).json({ items: [] });

    res.status(200).json(cart);
  } catch (err) {
    res.status(500).json({ message: "Error fetching cart", error: err.message });
  }
};

// ✅ Add item to cart
exports.addToCart = async (req, res) => {
  try {
    const { userId, foodId, quantity = 1 } = req.body;
    if (!userId || !foodId) {
      return res.status(400).json({ message: "userId and foodId required" });
    }

    const food = await Food.findById(foodId);
    if (!food) return res.status(404).json({ message: "Food not found" });

    let cart = await Cart.findOne({ userId });
    if (!cart) cart = new Cart({ userId, items: [] });

    const itemIndex = cart.items.findIndex(
      (item) => item.foodId.toString() === foodId
    );

    if (itemIndex > -1) {
      cart.items[itemIndex].quantity += quantity;
    } else {
      cart.items.push({
        foodId,
        quantity,
        price: food.foodPrice,
      });
    }

    cart.updatedAt = Date.now();
    await cart.save();

    res.json(cart);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// ✅ Update item quantity
exports.updateQuantity = async (req, res) => {
  try {
    const { userId, foodId, quantity } = req.body;
    if (!userId || !foodId) {
      return res.status(400).json({ message: "userId and foodId required" });
    }

    let cart = await Cart.findOne({ userId });
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    const itemIndex = cart.items.findIndex((item) => item.foodId.toString() === foodId);
    if (itemIndex === -1) return res.status(404).json({ message: "Item not in cart" });

    cart.items[itemIndex].quantity = quantity;
    cart.updatedAt = Date.now();

    await cart.save();
    res.status(200).json(cart);
  } catch (err) {
    res.status(500).json({ message: "Error updating quantity", error: err.message });
  }
};

  // ✅ Remove item from cart
exports.removeItem = async (req, res) => {
  try {
    const { userId, foodId } = req.body;

    if (!userId || !foodId) {
      return res.status(400).json({ message: "Missing userId or foodId" });
    }

    const cart = await Cart.findOne({ userId });
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    // Remove item by filtering out matching foodId
    cart.items = cart.items.filter(
      (item) => item.foodId.toString() !== foodId
    );

    await cart.save();

    res.status(200).json({ success: true, cart });
  } catch (err) {
    console.error("❌ Error removing item:", err);
    res.status(500).json({ message: "Error removing item", error: err.message });
  }
};
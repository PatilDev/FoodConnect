const mongoose= require("mongoose");
const cartSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, unique: true },
    items: [
      {
        foodId: { type: mongoose.Schema.Types.ObjectId, ref: "Food", required: true },
        quantity: { type: Number, default: 1, min: 1 },
        price: { type: Number, required: true },
      },
    ],
  },
  { timestamps: { createdAt: false, updatedAt: true } } // 👈 auto-manages updatedAt
);
const Cart= mongoose.model("Cart",cartSchema);
module.exports = Cart;
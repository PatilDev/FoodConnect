const Razorpay = require("razorpay");
const crypto = require("crypto");
const Order = require("../models/ordermodel");
const Cart = require("../models/cartModel");
const Food = require("../models/foodModel")

// ✅ Create Razorpay order
exports.createOrder = async (req, res) => {
  try {
    const { amount } = req.body;
    if (!amount) return res.status(400).json({ message: "Amount required" });

    const instance = new Razorpay({
      key_id: process.env.RAZORPAY_KEY,
      key_secret: process.env.RAZORPAY_SECRET,
    });

    const options = {
      amount: amount * 100, // paise
      currency: "INR",
      receipt: "order_rcptid_" + Date.now(),
    };


    const order = await instance.orders.create(options);


    res.status(201).json(order);
  } catch (err) {
    res.status(500).json({ message: "Error creating Razorpay order", error: err.message });
  }
};

// ✅ Save order after successful payment
exports.saveOrder = async (req, res) => {
  try {
    const {
      userId,
      addressId,
      cartId,
      paymentId,
      orderId,
      signature,
    } = req.body;

    if (!userId || !cartId || !paymentId || !orderId || !signature) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Verify Razorpay signature
    const body = orderId + "|" + paymentId;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_SECRET)
      .update(body.toString())
      .digest("hex");

    if (expectedSignature !== signature) {
      return res.status(400).json({ message: "Invalid payment signature" });
    }

    // Get cart details
    const cart = await Cart.findById(cartId).populate("items.foodId");
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    // Calculate total
    const totalAmount = cart.items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    // Save order
    const order = new Order({
      userId,
      addressId,
      cartId,
      items: cart.items,
      paymentId,
      razorpayOrderId: orderId,
      signature,
      amount: totalAmount,
      deliveryStatus: "pending", // default
    });

    await order.save();

    // Clear cart
    cart.items = [];
    await cart.save();

    res.status(201).json({ success: true, order });
  } catch (err) {
    console.error("❌ Error saving order:", err.message);
    res.status(500).json({ message: "Error saving order", error: err.message });
  }
};

// ✅ Get all orders for a user
exports.getUserOrders = async (req, res) => {
  try {
    const { userId } = req.query;
    if (!userId) return res.status(400).json({ message: "userId required" });

    const orders = await Order.find({ userId })
      .populate("items.foodId")
      .populate("addressId")
      .sort({ createdAt: -1 });

    res.status(200).json(orders);
  } catch (err) {
    res.status(500).json({ message: "Error fetching orders", error: err.message });
  }
};
// ✅ Get all pending orders for delivery boy with restaurant info
exports.getPendingOrders=("/order/pending", async (req, res) => {
  try {
    // Fetch all pending orders
    const pendingOrders = await Order.find({ deliveryStatus: "pending" })
      .populate("items.foodId")   // populate food details
      .populate("addressId");     // populate delivery address

    // Map orders to include restaurant details from food
    const ordersWithRestaurant = pendingOrders.map((order) => {
      const restaurantDetails = order.items.length > 0
        ? order.items[0].foodId.restaurantDetails
        : { restaurantName: "N/A", description: "" };

      return {
        ...order.toObject(),
        restaurantDetails,
      };
    });

    res.json({ pendingOrders: ordersWithRestaurant });
  } catch (err) {
    console.error("❌ Error fetching pending orders:", err.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
// ✅ Update delivery status by delivery boy
exports.updateDeliveryStatus = async (req, res) => {
  try {
    const { orderId, status } = req.body;

    if (!orderId || !status) {
      return res.status(400).json({ message: "orderId and status are required" });
    }

    // Only allow valid statuses
    const validStatuses = ["pending", "out-for-delivery", "delivered"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid delivery status" });
    }

    // Find order and update status
    const order = await Order.findByIdAndUpdate(
      orderId,
      { deliveryStatus: status },
      { new: true } // return updated document
    );

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.status(200).json({ success: true, message: "Delivery status updated", order });
  } catch (err) {
    console.error("❌ Error updating delivery status:", err.message);
    res.status(500).json({ message: "Error updating delivery status", error: err.message });
  }
};

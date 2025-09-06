const express = require("express");
const {
  createOrder,
  saveOrder,
  getUserOrders,
  getPendingOrders,
  updateDeliveryStatus,
} = require("../controller/orderController");

const router = express.Router();

router.post("/create", createOrder);   // Create Razorpay order
router.post("/save", saveOrder);       // Save order after payment
router.get("/", getUserOrders);
router.get("/pending",getPendingOrders);        
router.put("/update-status", updateDeliveryStatus);
module.exports = router;

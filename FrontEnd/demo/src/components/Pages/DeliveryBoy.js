import React, { useState, useEffect } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";

const BASEURL=process.env.REACT_APP_BASEURL;

const DeliveryBoyPage = () => {
  const [pendingOrders, setPendingOrders] = useState([]);

  const fetchPendingOrders = async () => {
    try {
      const { data } = await axios.get(`${BASEURL}/order/pending`); // destructure directly
      setPendingOrders(data.pendingOrders);
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch pending orders");
    }
  };

  const updateStatus = async (orderId) => {
    try {
      await axios.put(`${BASEURL}/order/update-status`, {
        orderId,
        status: "delivered",
      });
      toast.success("Order marked as delivered");
      fetchPendingOrders(); // refresh list
    } catch (err) {
      console.error(err);
      toast.error("Failed to update status");
    }
  };

  useEffect(() => {
    fetchPendingOrders();
  }, []);

  return (
    <div className="delivery-container">
      <h2>Pending Orders</h2>
      {pendingOrders.map((order) => (
  <div key={order._id} className="order-card">
    <h3>Restaurant: {order.restaurantName}</h3>
    <p>Delivery Address: {order.addressId?.street}, {order.addressId?.city}</p>
    <ul>
      {order.items.map((item) => (
        <li key={item.foodId._id}>
          {item.foodId.foodName} x {item.quantity}
        </li>
      ))}
    </ul>
    <p>Total: ₹{order.amount}</p>
    <button onClick={() => updateStatus(order._id)}>Mark as Delivered</button>
  </div>
))}

      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default DeliveryBoyPage;

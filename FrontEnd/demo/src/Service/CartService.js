// src/services/cartService.js
import axios from "axios";

const API_URL = process.env.REACT_APP_BASEURL;
const storedUser = JSON.parse(localStorage.getItem("user"));
const userId = storedUser?.id;

// ✅ Get cart
export const getCart = async () => {
  const res = await axios.get(`${API_URL}/cart?userId=${userId}`);
  return res.data;
};

// ✅ Add to cart
export const addToCart = async (foodId, quantity = 1) => {
  const res = await axios.post(`${API_URL}/cart/add`, { userId, foodId, quantity });
  return res.data;
};

// ✅ Update quantity
export const updateQuantity = async (foodId, quantity) => {
  const res = await axios.put(`${API_URL}/cart/update`, { userId, foodId, quantity });
  return res.data;
};

// ✅ Remove item
// CartService.js
export const removeItem = async ({ userId, foodId }) => {
  const res = await axios.delete(`${API_URL}/cart/remove`, {
    data: { userId, foodId }, // ✅ must be inside `data`
  });
  return res.data;
};


// ✅ Clear cart
export const clearCart = async () => {
  const res = await axios.delete(`${API_URL}/cart/clear`, { data: { userId } });
  return res.data;
};

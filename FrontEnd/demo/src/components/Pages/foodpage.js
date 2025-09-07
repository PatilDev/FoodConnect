import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { Card } from "reactstrap";
import "./FoodManager.css";

const API_URL = process.env.REACT_APP_BASEURL;

export default function FoodManager() {
  const [foods, setFoods] = useState([]);
  const [addresses, setAddresses] = useState([]);
  const [formData, setFormData] = useState({
    addressId: "",
    foodName: "",
    restaurantName: "",
    description: "",
    foodImage: null,
    foodPrice: "",
  });

  const storedUser = JSON.parse(localStorage.getItem("user"));
  const userId = storedUser?.id;

  // ✅ Fetch foods depending on role
  const fetchFoods = useCallback(async () => {
    try {
      let url = `${API_URL}/food`;
      if (storedUser?.role === "ROLE_RESTAURANT_OWNER") {
        url = `${API_URL}/food/${userId}`;
      }
      const res = await axios.get(url);
      setFoods(res.data);
    } catch (err) {
      console.error("Error fetching foods:", err);
    }
  }, [storedUser?.role, userId]);

  useEffect(() => {
    fetchFoods();
  }, [fetchFoods]);

  // ✅ Load addresses of logged-in restaurant owner
  useEffect(() => {
    if (!userId) return;
    const fetchAddresses = async () => {
      try {
        const res = await axios.get(`${API_URL}/address?userId=${userId}`);
        setAddresses(res.data || []);
      } catch (err) {
        console.error("Error fetching addresses:", err);
      }
    };
    if (storedUser?.role === "ROLE_RESTAURANT_OWNER") {
      fetchAddresses();
    }
  }, [userId, storedUser?.role]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "foodImage") {
      setFormData({ ...formData, foodImage: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = new FormData();
      data.append("addressId", formData.addressId);
      data.append("foodName", formData.foodName);
      data.append(
        "restaurantDetails",
        JSON.stringify({
          restaurantName: formData.restaurantName,
          description: formData.description,
        })
      );
      data.append("foodPrice", Number(formData.foodPrice));
      if (formData.foodImage) {
        data.append("foodImage", formData.foodImage);
      }

      await axios.post(`${API_URL}/food`, data, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      fetchFoods();
      setFormData({
        addressId: "",
        foodName: "",
        restaurantName: "",
        description: "",
        foodImage: null,
        foodPrice: "",
      });
    } catch (err) {
      console.error("Error adding food:", err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_URL}/food/${id}`);
      fetchFoods();
    } catch (err) {
      console.error("Error deleting food:", err);
    }
  };

  // ✅ Add To Cart handler
  const handleAddToCart = async (foodId) => {
    try {
      await axios.post(`${API_URL}/cart/add`, { userId, foodId, quantity: 1 });
      alert("✅ Item added to cart!");
    } catch (err) {
      console.error("Error adding to cart:", err);
      alert("❌ Failed to add item to cart");
    }
  };

  return (
    <div className="food-manager-wrapper">
      {/* Only Restaurant Owner can add foods */}
      {storedUser?.role === "ROLE_RESTAURANT_OWNER" && (
        <Card className="food-card">
          <h2>🍴 Food Manager</h2>
          <form onSubmit={handleSubmit} className="food-form">
            <select
              name="addressId"
              value={formData.addressId}
              onChange={handleChange}
              required
            >
              <option value="">-- Select Address --</option>
              {addresses.map((addr) => (
                <option key={addr._id} value={addr._id}>
                  {addr.street}, {addr.city}
                </option>
              ))}
            </select>

            <input
              type="text"
              name="foodName"
              placeholder="Food Name"
              value={formData.foodName}
              onChange={handleChange}
              required
            />
            <input
              type="text"
              name="restaurantName"
              placeholder="Restaurant Name"
              value={formData.restaurantName}
              onChange={handleChange}
              required
            />
            <input
              type="text"
              name="description"
              placeholder="Description"
              value={formData.description}
              onChange={handleChange}
            />
            <input type="file" name="foodImage" onChange={handleChange} />

            <input
              type="number"
              name="foodPrice"
              placeholder="Price"
              value={formData.foodPrice}
              onChange={handleChange}
              required
            />

            <button type="submit">➕ Add Food</button>
          </form>
        </Card>
      )}

      {/* Food List */}
      <Card className="food-card">
        <h3 style={{ fontFamily: "Times New Roman", textAlign: "center" }}>
          {storedUser?.role === "ROLE_RESTAURANT_OWNER"
            ? "📋 My Added Foods"
            : "📋 Available Foods"}
        </h3>

        <ul className="food-list">
          {foods.map((food) => (
            <li key={food._id}>
              <strong>{food.foodName}</strong> -{" "}
              {food.restaurantDetails?.restaurantName} <br />
              {food.restaurantDetails?.description}
              <br />
              {food.foodPrice && <> ₹ {food.foodPrice}</>}
              <br />
              {food.foodImage && (
                <img src={food.foodImage} alt="food" width="120" />
              )}
              <br />
              {storedUser?.role === "ROLE_RESTAURANT_OWNER" && (
                <button
                  className="btn-delete"
                  onClick={() => handleDelete(food._id)}
                >
                  🗑️ Delete
                </button>
              )}
              {storedUser?.role === "ROLE_CUSTOMER" && (
                <button
                  className="btn-cart"
                  onClick={() => handleAddToCart(food._id)}
                >
                  🛒 Add To Cart
                </button>
              )}
            </li>
          ))}
        </ul>
      </Card>
    </div>
  );
}

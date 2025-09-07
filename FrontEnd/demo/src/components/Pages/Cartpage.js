import React, { useEffect, useState } from "react";
import { getCart, updateQuantity, removeItem } from "../../Service/CartService";
import axios from "axios";
import Header from "./header";
import {
  Card,
  CardBody,
  CardHeader,
  ListGroup,
  ListGroupItem,
  Button,
  Spinner,
  Input,
} from "reactstrap";

const API_URL = process.env.REACT_APP_BASEURL;

export default function CartPage() {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState("");

  const storedUser = JSON.parse(localStorage.getItem("user"));
  const userId = storedUser?.id;

  useEffect(() => {
    const fetchAddresses = async () => {
      try {
        const res = await axios.get(`${API_URL}/address?userId=${userId}`);
        setAddresses(res.data || []);
      } catch (err) {
        console.error("Error fetching addresses:", err);
      }
    };

    loadCart();
    fetchAddresses();
  }, [userId]);

  const loadCart = async () => {
    try {
      setLoading(true);
      const data = await getCart();
      setCart(data);
    } catch (err) {
      console.error("Error fetching cart:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleIncrease = async (foodId, qty) => {
    await updateQuantity(foodId, qty + 1);
    loadCart();
  };

  const handleDecrease = async (foodId, qty) => {
    if (qty > 1) {
      await updateQuantity(foodId, qty - 1);
      loadCart();
    }
  };

const handleRemove = async (foodId) => {
  try {
    await removeItem({ userId, foodId }); // send both userId & foodId
    loadCart(); // refresh cart
  } catch (err) {
    console.error("Error removing item:", err);
  }
};


  const handlePayment = async () => {
    if (!selectedAddress) {
      alert("⚠️ Please select an address");
      return;
    }

    const totalAmount = cart.items.reduce((sum, i) => sum + i.price * i.quantity, 0);

    try {
      const { data } = await axios.post(`${API_URL}/order/create`, {
        userId,
        addressId: selectedAddress,
        amount: totalAmount,
      });

      const options = {
        key: process.env.REACT_APP_RAZORPAY_KEY,
        amount: data.amount,
        currency: "INR",
        name: "FoodConnect",
        description: "Food Order Payment",
        order_id: data.id,
        handler: async function (response) {
          await axios.post(`${API_URL}/order/save`, {
            userId,
            addressId: selectedAddress,
            cartId: cart._id,
            paymentId: response.razorpay_payment_id,
            orderId: response.razorpay_order_id,
            signature: response.razorpay_signature,
            deliveryStatus: "Undelivered",
          });

          alert("✅ Payment successful & order placed!");
          loadCart();
        },
        prefill: {
          name: storedUser?.fullName || "Demo User",
          email: storedUser?.email || "demo@example.com",
          contact: "9999999999",
        },
        theme: { color: "#3399cc" },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      console.error("Payment Error:", err);
      alert("❌ Payment failed, try again.");
    }
  };

  return (
    <>
      <Header />
<div style={{paddingBottom:"3%",paddingTop:"10%"}}>
      {loading ? (
        <div className="text-center mt-5">
          <Spinner color="primary" />
          <p>Loading your cart...</p>
        </div>
      ) : !cart || cart.items.length === 0 ? (
        <div className="text-center mt-5">
          <h2>Your Cart is Empty 🛒</h2>
        </div>
      ) : (
        <div style={{ paddingTop: "5%" }}>
          <Card className="container shadow">
            <CardHeader className="bg-dark text-white text-center">
              <h2>Your Cart 🛒</h2>
            </CardHeader>
            <CardBody>
              <ListGroup flush>
  {cart.items.map((item, idx) => (
    <ListGroupItem
      key={item.foodId?._id || idx}   // fallback to idx if no _id
      className="d-flex justify-content-between align-items-center"
    >
      <div>
        <h5 className="mb-1">
          {item.foodId ? item.foodId.foodName : "Unknown Item"}
        </h5>
        <small className="text-muted">
          ₹{item.price} × {item.quantity}
        </small>
      </div>

      <div>
        <Button
          color="success"
          size="sm"
          className="me-2"
          onClick={() =>
            item.foodId && handleIncrease(item.foodId._id, item.quantity)
          }
          disabled={!item.foodId}
        >
          +
        </Button>
        <Button
          color="warning"
          size="sm"
          className="me-2"
          onClick={() =>
            item.foodId && handleDecrease(item.foodId._id, item.quantity)
          }
          disabled={!item.foodId}
        >
          -
        </Button>
        <Button
          color="danger"
          size="sm"
          onClick={() => item.foodId && handleRemove(item.foodId._id)}
          disabled={!item.foodId}
        >
          Remove
        </Button>
      </div>
    </ListGroupItem>
  ))}
</ListGroup>

              <hr />

              <h3 className="text-end mt-3">
                Total:{" "}
                <span className="text-success">
                  ₹{cart.items.reduce((sum, i) => sum + i.price * i.quantity, 0)}
                </span>
              </h3>

              <hr />

              <h5>Select Delivery Address</h5>
              <Input
                type="select"
                value={selectedAddress}
                onChange={(e) => setSelectedAddress(e.target.value)}
              >
                <option value="">-- Choose Address --</option>
                {addresses.map((addr) => (
                  <option key={addr._id} value={addr._id}>
                    {addr.street}, {addr.city}, {addr.state}
                  </option>
                ))}
              </Input>

              <div className="text-end mt-3">
                <Button color="primary" onClick={handlePayment}>
                  Pay & Order
                </Button>
              </div>
            </CardBody>
          </Card>
        </div>
      )}
      </div>
    </>
  );
}

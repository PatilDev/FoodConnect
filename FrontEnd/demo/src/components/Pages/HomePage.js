import React, { useEffect } from "react";
import Header from "./header";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Card } from "reactstrap";
import FoodManager from "./foodpage";
import DeliveryBoyPage from "./DeliveryBoy";

const HomePage = () => {
  const storedUser = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    if (storedUser?.fullName) {
      toast.success(`Welcome ${storedUser.fullName}`);
    }
  }, [storedUser?.fullName]);

  return (
    <div style={{backgroundColor:"rgba(255, 251, 214, 0.99)"}}>
      <Header />

      {/* Category Card */}
      <Card
        className="container"
        style={{
          maxWidth: "100%",
          whiteSpace: "nowrap",
          overflowX: "auto",
          scrollbarWidth: "thin",
          border: "2px solid rgba(67, 174, 1, 0.9)",
          padding: "10px",
          paddingTop:"10%",
          backgroundColor:"rgba(255, 255, 255, 1)"
        }}
      >
        <center>
          <h2 style={{ marginTop: "0" }}>What you want! 😋</h2>

          <div style={{ display: "inline-block", padding: "0 20px" }}>
            🍔 Burger
          </div>
          <div style={{ display: "inline-block", padding: "0 20px" }}>
            🍕 Pizza
          </div>
          <div style={{ display: "inline-block", padding: "0 20px" }}>
            🥗 Salad
          </div>
          <div style={{ display: "inline-block", padding: "0 20px" }}>
            🍜 Noodles
          </div>
        </center>
      </Card>

      {/* Food Manager Section */}
       {storedUser?.role === "ROLE_RESTAURANT_OWNER" && (
      <FoodManager />)}
      {storedUser?.role === "ROLE_DELIVERY_BOY" && (
      <DeliveryBoyPage/>)}

      {storedUser?.role === "ROLE_CUSTOMER" && (<><center><FoodManager /></center></>
      )}


      {/* Toast notifications */}
      <ToastContainer position="top-right" autoClose={2000} />
    </div>
  );
};


export default HomePage;

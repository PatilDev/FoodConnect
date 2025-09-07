import React, { useEffect, useState } from "react";
import { Card, CardBody, CardTitle, CardText, Button } from "reactstrap";
import { useNavigate } from "react-router-dom";
import Header from "./header";
import AddressPage from "./AddressPage";
import NotFound from "./NotFound";

const UserProfile = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    navigate("/"); // back to home/login
  };

  if (!user)
    return (
      <>
        <p>Something went wrong...</p>
        <NotFound />
      </>
    );

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      {/* Header at top */}
      <div style={{ position: "sticky", top: 0, zIndex: 1000 }}>
        <Header />
      </div>

      {/* Centered card */}
      <div
        style={{
          flex: 1,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          padding: "20px",
          backgroundColor: "#f2f2f2",
        }}
      >
        <Card
          style={{
            width: "60rem",
            maxWidth: "95%",
            borderRadius: "30px",
            boxShadow: "2px 4px 10px rgba(53, 3, 3, 0.7)",
            backgroundColor: "white",
            padding: "30px",
          }}
        >
          <h1 style={{ color: "rgba(0, 115, 255, 1)" }}>User Details</h1>
          <hr />
          <CardBody>
            <CardTitle tag="h4" className="text-primary">
              {user.fullName || "Guest User"}
            </CardTitle>
            <CardText>
              <b>Email:</b> {user.email}
            </CardText>
            <CardText>
              <b>Role:</b> {user.role}
            </CardText>
            <AddressPage userId={user.id} />
            <div className="d-flex justify-content-end mt-3">
              <Button color="danger" onClick={handleLogout}>
                Logout
              </Button>
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
};

export default UserProfile;

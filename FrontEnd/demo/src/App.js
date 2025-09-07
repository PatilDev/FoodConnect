import React, { useState, useEffect } from "react";
import {
  signup,
  login,
  getProfile,
  logout,
  isAuthenticated,
  getUser,
} from "./Service/AuthService";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { Button, Card, CardBody, Form, FormGroup, Input, Label } from "reactstrap";
import UserProfile from "./components/Pages/userDetails";
import HomePage from "./components/Pages/HomePage";
import AddressFormPage from "./components/Pages/AddressFormPage";
import CartPage from "./components/Pages/Cartpage";
import NotFound from "./components/Pages/NotFound";
import About from "./components/Pages/aboutas";

function Home() {
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    password: "",
    role: "",
  });
  const [user, setUser] = useState(null);
  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    if (isAuthenticated()) {
      const storedUser = getUser();
      if (storedUser) setUser(storedUser);
      handleGetProfile();
    }
  }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSignup = async () => {
    try {
      const data = await signup(form);
      if (data.token) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        setUser(data.user);
        toast.success("Login successful ✅");
        resetForm();
      }
    } catch (err) {
      toast.error(err.response?.data?.error || "Signup failed");
    }
  };

  const handleLogin = async () => {
    try {
      const { email, password, role } = form;
      const data = await login({ email, password, role });
      if (data.token) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        setUser(data.user);
        toast.success("Login successful ✅");
        resetForm();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Login failed");
    }
  };

  const handleGetProfile = async () => {
    try {
      const data = await getProfile();
      setUser(data);
    } catch (err) {}
  };

  const handleLogout = () => {
    logout();
    setUser(null);
    resetForm();
    toast.info("Logged out successfully");
  };

  const resetForm = () => {
    setForm({ fullName: "", email: "", password: "", role: "" });
    setEditMode(false);
  };

  // Inline styles
  const styles = {
    container: {
      minHeight: "100vh",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      background: "#f0f2f5",
      flexDirection: "column",
      padding: "20px",
    },
    card: {
      width: "100%",
      maxWidth: "400px",
      padding: "20px",
      borderRadius: "15px",
      boxShadow: "0 6px 20px rgba(0,0,0,0.15)",
    },
    title: {
      color: "#0073ff",
      textAlign: "center",
      marginBottom: "20px",
    },
    input: {
      marginBottom: "15px",
    },
    buttonGroup: {
      display: "flex",
      justifyContent: "space-between",
      gap: "10px",
      marginTop: "10px",
    },
    logout: {
      position: "fixed",
      top: "15px",
      right: "15px",
    },
  };

  return (
    <div style={styles.container}>
      {!user && !editMode && (
        <Card style={styles.card}>
          <CardBody>
            <h2 style={styles.title}>Welcome 👋</h2>
            <Form autoComplete="off">
              {/* Hidden dummy inputs to prevent browser autofill */}
              <input type="text" style={{ display: "none" }} />
              <input type="password" style={{ display: "none" }} />

              <FormGroup>
                <Label for="fullName">Full Name</Label>
                <Input
                  id="fullName"
                  type="text"
                  name="fullName"
                  placeholder="Enter full name"
                  value={form.fullName}
                  onChange={handleChange}
                  style={styles.input}
                  autoComplete="off"
                />
              </FormGroup>

              <FormGroup>
                <Label for="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  name="email"
                  placeholder="Enter email"
                  value={form.email}
                  onChange={handleChange}
                  style={styles.input}
                  autoComplete="off"
                />
              </FormGroup>

              <FormGroup>
                <Label for="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  name="password"
                  placeholder="Enter password"
                  value={form.password}
                  onChange={handleChange}
                  style={styles.input}
                  autoComplete="new-password"
                />
              </FormGroup>

              <FormGroup>
                <Label for="role">Role</Label>
                <Input
                  id="role"
                  type="select"
                  name="role"
                  value={form.role}
                  onChange={handleChange}
                  style={styles.input}
                  autoComplete="off"
                >
                  <option value="">-- Select Role --</option>
                  <option value="ROLE_CUSTOMER">Customer</option>
                  <option value="ROLE_RESTAURANT_OWNER">Restaurant Owner</option>
                  <option value="ROLE_DELIVERY_BOY">Delivery Boy</option>
                </Input>
              </FormGroup>

              <div style={styles.buttonGroup}>
                <Button color="primary" onClick={handleSignup} block>
                  Signup
                </Button>
                <Button color="secondary" onClick={handleLogin} block>
                  Login
                </Button>
              </div>
            </Form>
          </CardBody>
        </Card>
      )}

      {user && <Navigate to="/home" replace />}

      {user && (
        <div style={styles.logout}>
          <Button color="danger" onClick={handleLogout}>
            Logout
          </Button>
        </div>
      )}

      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/home" element={<HomePage />} />
        <Route path="/" element={<Home />} />
        <Route path="/*" element={<NotFound />} />
        <Route path="/user" element={<UserProfile />} />
        <Route path="/about" element={<About />} />
        <Route path="/address/edit/:id" element={<AddressFormPage />} />
        <Route path="/address/add/:userId" element={<AddressFormPage />} />
        <Route path="/cart" element={<CartPage />} />
      </Routes>
    </Router>
  );
}

export default App;

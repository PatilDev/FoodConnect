import React, { useState, useEffect } from "react";
import { Form, FormGroup, Label, Input, Button, Card, CardBody } from "reactstrap";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import Header from "./header";

const API_URL = process.env.REACT_APP_BASEURL;

const AddressFormPage = () => {
  const { id } = useParams(); // id = addressId if edit
  const navigate = useNavigate();
  const storedUser = JSON.parse(localStorage.getItem("user"));
  const userId = storedUser?.id;

  const [form, setForm] = useState({
    street: "",
    city: "",
    state: "",
    zipCode: "",
    country: "",
  });

  // Load existing address if editing
  useEffect(() => {
    if (id) {
      axios
        .get(`${API_URL}/address/${id}`)
        .then((res) => setForm(res.data))
        .catch((err) => console.error(err));
    }
  }, [id]);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (id) {
        await axios.put(`${API_URL}/address/${id}`, form);
      } else {
        await axios.post(`${API_URL}/address?userId=${userId}`, form);
      }
      navigate("/user"); // back to user page
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
    <Header/>
    <div
      style={{
        minHeight: "80vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "20px",
        backgroundColor: "#f8f9fa",
      }}
    >
      <Card style={{ width: "100%", maxWidth: "600px", borderRadius: "20px", boxShadow: "0 4px 15px rgba(0,0,0,0.2)" }}>
        <CardBody>
          <h3 className="text-center mb-4">{id ? "Update Address" : "Add Address"}</h3>
          <Form onSubmit={handleSubmit}>
            {["street", "city", "state", "zipCode", "country"].map((field) => (
              <FormGroup key={field}>
                <Label>{field.charAt(0).toUpperCase() + field.slice(1)}</Label>
                <Input
                  name={field}
                  value={form[field]}
                  onChange={handleChange}
                  required
                />
              </FormGroup>
            ))}
            <div className="d-flex justify-content-end mt-3">
              <Button type="submit" color="primary">
                {id ? "Update" : "Add"}
              </Button>
              <Button
                color="secondary"
                className="ms-2"
                onClick={() => navigate("/user")}
              >
                Cancel
              </Button>
            </div>
          </Form>
        </CardBody>
      </Card>
    </div>
    </>
  );
};

export default AddressFormPage;

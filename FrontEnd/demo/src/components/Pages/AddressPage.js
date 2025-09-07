import React, { useEffect, useState } from "react";
import { Card, CardBody, CardTitle, CardText, Button } from "reactstrap";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const API_URL = process.env.REACT_APP_BASEURL;

const AddressPage = () => {
  const [addresses, setAddresses] = useState([]);
  const navigate = useNavigate();
  const storedUser = JSON.parse(localStorage.getItem("user"));
  const userId = storedUser?.id;
useEffect(() => {
  if (!userId) return;

  const fetchAddresses = async () => {
    try {
      const res = await axios.get(`${API_URL}/address?userId=${userId}`);
      setAddresses(res.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  fetchAddresses();
}, [userId]);


  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_URL}/address/${id}`);
      setAddresses(addresses.filter(a => a._id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="container" style={{
      borderRadius: "30px",
      boxShadow: "2px 4px 10px rgba(78, 1, 49, 0.7)",
      padding: "20px",
      marginTop: "20px",
      maxHeight: "300px",
  overflowY: "auto"   
    }}>
      <h1 style={{color:"blue"}}>Address</h1>
      <hr />
     <Button color="primary" onClick={() => navigate(`/address/add/${userId}`)}>
  Add Address
</Button>


      {addresses.length === 0 ? (
        <p>No addresses found</p>
      ) : (
        addresses.map(addr => (
          <Card key={addr._id} className="mb-3 mt-3">
            <CardBody>
              <CardTitle tag="h5">{addr.street}, {addr.city}</CardTitle>
              <CardText>
                {addr.state && <>State: {addr.state}<br /></>}
                {addr.zipCode && <>Zip: {addr.zipCode}<br /></>}
                {addr.country && <>Country: {addr.country}</>}
              </CardText>
              <Button
                style={{ backgroundColor: "green", color:"white"}}
                className="me-2"
                onClick={() => navigate(`/address/edit/${addr._id}`)}
              >
                Update
              </Button>
              <Button style={{ marginLeft:"3%", backgroundColor: "red",color:"white" }} onClick={() => handleDelete(addr._id)} >
                Delete
              </Button><hr/>
            </CardBody>
          </Card>
        ))
      )}
    </div>
  );
};

export default AddressPage;

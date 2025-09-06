const { newAddress, getAddressesByUserId, updateAddress, deleteAddress } = require("../service/addressService");
const Address = require("../models/addressModel");

// Create new address
exports.createAddress = async (req, res) => {
  try {
    // console.log("📥 req.body:", req.body);
    // console.log("📥 req.query:", req.query);

    const { userId, street, city, state, zipCode, country } = req.body;
    const address = await Address.create({
      userId: userId || req.query.userId, // support both
      street,
      city,
      state,
      zipCode,
      country,
    });

    res.status(201).json(address);
  } catch (err) {
    console.error("❌ Error creating address:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};


// Get all addresses by userId from body
exports.getAddresses = async (req, res) => {
  try {
    const { userId } = req.query;
    const addresses = await getAddressesByUserId(userId);
    res.json(addresses);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Update an address
exports.updateAddress = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedAddress = await updateAddress(id, req.body);
    if(updatedAddress){
       res.status(200).json("Address Updated ...");
    }
   
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Delete an address
exports.deleteAddress = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await deleteAddress(id);
    res.json({ message: result });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

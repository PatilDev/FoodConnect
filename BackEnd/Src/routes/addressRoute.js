const express = require("express");
const router = express.Router();
const addressController = require("../controller/addressController");

router.post("/", addressController.createAddress); //http://localhost:5454/address?userId=USER_ID

// Get all addresses of a user
router.get("/", addressController.getAddresses); //http://localhost:5454/address?userId=

router.put("/:id", addressController.updateAddress);//http://localhost:5454/address/ADDRESS_ID


router.delete("/:id", addressController.deleteAddress);//http://localhost:5454/address/ADDRESS_ID

module.exports = router;

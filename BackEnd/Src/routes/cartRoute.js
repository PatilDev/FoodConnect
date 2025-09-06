const express = require("express");
const { getCart, addToCart, updateQuantity, removeItem} = require("../controller/cartController")

const router = express.Router();

router.get("/",  getCart);
router.post("/add",  addToCart);
router.put("/update", updateQuantity);
router.delete("/remove", removeItem);
module.exports = router;

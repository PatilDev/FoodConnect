require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const addressRouter= require("./routes/addressRoute")
const authRoutes = require("./routes/authRoutes");
const foodRouter = require("./routes/foodRoute")
const userRouter = require("./routes/userRoutes");
const cartRouter = require("./routes/cartRoute")
const orderRoutes = require("./routes/orderRoutes");


const app = express();

app.use(cors({ origin: process.env.FRONTEND, credentials: true }));
app.use(express.json());

// Routes
app.use("/user", userRouter);

app.use("/auth", authRoutes);
app.use("/address",addressRouter)
app.use("/food",foodRouter)
app.use("/cart",cartRouter)
app.use("/order", orderRoutes);

const PORT=process.env.PORT;
// app.use("/order",orderRouter)
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    app.listen(PORT, () => console.log("✅ Server running"));
  })
  .catch((err) => console.error(err));
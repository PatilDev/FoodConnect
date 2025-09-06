const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema({
    userId:{type:mongoose.Schema.Types.ObjectId, ref:"User", require:true},
    restaurant:{type:mongoose.Schema.Types.ObjectId, ref:"Food",require:true}},
    { timestamps: true });

const Payment = mongoose.model("Payment",paymentSchema);
module.exports = Payment;
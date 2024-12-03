import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({


}, {
    timestamps: true,
});

const orderModel = mongoose.model("orders", orderSchema);
export default orderNodel;
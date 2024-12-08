import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
    filmName: {
        type: String
    },
    date: {
        type: Date,
        required: true
    },
    time: {
        type: String,
        required: true
    },
    verifyCode: {
        type: String,
        required: true
    },
    roomName: {
        type: String
    },
    seatName: {
        type: String
    },
    totalMoney: {
        type: Number,
        required: true
    },
    items: [{
        type: mongoose.Schema.Types.Mixed
    }],
    customerID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users"
    },
    online: {
        type: Boolean,
        required: true
    },
    printed: {
        type: Boolean,
        default: false
    },
    served: {
        type: Boolean,
        default: false
    },
    invalidReason: {
        type: String,
        default: ""
    },
}, {
    timestamps: true,
});

const orderModel = mongoose.model("orders", orderSchema);
export default orderModel;
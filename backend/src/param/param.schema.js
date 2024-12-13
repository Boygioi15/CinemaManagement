import mongoose from "mongoose";

const ticketSchema = new mongoose.Schema({
    filmName: {
        type: String,
        required: false
    },
    date: {
        type: String,
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
        type: String,
        required: false
    },
    seatName: {
        type: String,
        required: false
    },
    totalMoney: {
        type: Number,
        required: true
    },
    items: [{
        name: {
            type: String,
            required: true
        },
        quantity: {
            type: String,
            required: true
        },
        unitPrice: {
            type: String,
            required: true
        },
        approved: {
            type: Boolean,
            default: false
        }
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
    }
}, {
    timestamps: true
});

const ticketModel = mongoose.model("tickets", ticketSchema);
export default ticketModel;
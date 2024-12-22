import mongoose from "mongoose";

const seatSchema = new mongoose.Schema({
    seatName: {
        type: String,
        required: true
    },
    isPairSeat: {
        type: Boolean,
        default: false
    },
    seatCol: {
        type: Number,
        required: true
    },
    seatRow: {
        type: Number,
        required: true
    },
    usable: {
        type: Boolean,
        default: true
    },
    deleted: {
        type: Boolean,
        default: false
    },
    other: {
        type: String
    },
    roomId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "rooms",
        required: true
    },
}, {
    timestamps: true,
});

const seatModel = mongoose.model("seats", seatSchema);
export default seatModel;
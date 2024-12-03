import mongoose from "mongoose";

const seatSchema = new mongoose.Schema({
    seatName: {
        type: String,
        required: true,
    },
    isPairSeat: {
        type: Boolean,
        default: false
    },
    seatCol: {
        type: Number,
        required: true,
    },
    seatRow: {
        type: Number,
        required: true,
    },
    usable: {
        type: Boolean,
        default: true
    },
    other: {
        type: String,
    },

}, {
    timestamps: true,
});

const seatModel = mongoose.model("seats", seatSchema);
export default seatModel;
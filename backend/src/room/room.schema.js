import mongoose from "mongoose";

const roomSChema = new mongoose.Schema({
    roomName: {
        type: String,
        required: true,
    },
    noOfSeatRow: {
        type: Number,
        required: true,
    },
    noOfSeatInEachRow: {
        type: Number,
        required: true,
    },
    seats: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "seats"
    }],
    other: {
        type: String,
    },
    deleted: {
        type: Boolean,
        required: false,
    }

}, {
    timestamps: true,
});

const roomModel = mongoose.model("rooms", roomSChema);
export default roomModel;
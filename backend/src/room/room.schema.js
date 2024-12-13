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
    centerX2: {
        type: Number,
        require: true
    },
    centerX1: {
        type: Number,
        require: true
    },
    centerY1: {
        type: Number,
        require: true
    },
    centerY2: {
        type: Number,
        require: true
    },
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
import mongoose from "mongoose";

const roomSchema = new mongoose.Schema(
  {
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
    seats: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "seats",
      },
    ],
    centerX2: {
      type: Number,
      required: true,
    },
    centerX1: {
      type: Number,
      required: true,
    },
    centerY1: {
      type: Number,
      required: true,
    },
    centerY2: {
      type: Number,
      required: true,
    },
    other: {
      type: String,
    },
    deleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const roomModel = mongoose.model("rooms", roomSchema);
export default roomModel;

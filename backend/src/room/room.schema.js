import mongoose from "mongoose";

const seatSchema = new mongoose.Schema({
  seatName: {
    type: String,
    required: true,
  },
  isPairSeat: {
    type: Boolean,
    default: false,
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
    default: true,
  },
  other: {
    type: String,
  },
});
const roomSChema = new mongoose.Schema(
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
    seats: [seatSchema],
    centerX2: {
      type: Number,
      require: true,
    },
    centerX1: {
      type: Number,
      require: true,
    },
    centerY1: {
      type: Number,
      require: true,
    },
    centerY2: {
      type: Number,
      require: true,
    },
    other: {
      type: String,
    },
    deleted: {
      type: Boolean,
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

const roomModel = mongoose.model("rooms", roomSChema);
export default roomModel;

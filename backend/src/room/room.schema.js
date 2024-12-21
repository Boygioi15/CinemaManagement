import mongoose from "mongoose";

const seatSchema = new mongoose.Schema({
  seatName: {
    type: String,
    required: true,
  },
  seatType: {
    type: String,
    default: "",
  },
  usable: {
    type: Boolean,
    default: true,
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
      min: [1, "Số hàng ghế phải là một số lớn hơn 0"], // Ensures greater than 0
    },
    noOfSeatInEachRow: {
      type: Number,
      required: true,
      min: [1, "Số ghế mỗi hàng phải là một số lớn hơn 0"], // Ensures greater than 0
    },

    centerX1: {
      type: Number,
      required: true,
      min: [1, "centerX1 phải là một số lớn hơn 0"], // Ensures greater than 0
    },
    centerX2: {
      type: Number,
      required: true,
      min: [1, "centerX2 phải là một số lớn hơn 0"], // Ensures greater than 0
    },
    centerY1: {
      type: Number,
      required: true,
      min: [1, "centerY1 phải là một số lớn hơn 0"], // Ensures greater than 0
    },
    centerY2: {
      type: Number,
      required: true,
      min: [1, "centerY2 phải là một số lớn hơn 0"], // Ensures greater than 0
    },

    seats: [[seatSchema]],
    roomNote: {
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

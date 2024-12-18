import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    verifyCode: {
      type: String,
    },
    filmName: {
      type: String,
      required: false,
    },
    date: {
      type: String,
      required: true,
    },
    time: {
      type: String,
      required: true,
    },
    roomName: {
      type: String,
      required: false,
    },
    seatNames: [
      {
        type: String,
      },
    ],
    totalMoney: {
      type: Number,
      required: true,
    },
    tickets: [
      {
        name: {
          type: String,
          required: true,
        },
        quantity: {
          type: String,
          required: true,
        },
        unitPrice: {
          type: String,
          required: true,
        },
      },
    ],
    items: [
      {
        name: {
          type: String,
          required: true,
        },
        quantity: {
          type: String,
          required: true,
        },
        unitPrice: {
          type: String,
          required: true,
        },
      },
    ],
    customerID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
    },
    customerInfo: {
      name: {
        type: String,
        required: true,
      },
      email: {
        type: String,
        required: true,
      },
      phone: {
        type: String,
        required: true,
      },
    },
    online: {
      type: Boolean,
      default: true,
    },
    served: {
      type: Boolean,
      default: false,
    },
    invalidReason: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

const orderModel = mongoose.model("orders", orderSchema);
export default orderModel;

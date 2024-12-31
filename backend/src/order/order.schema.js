import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  verifyCode: {
    type: String,
  },
  filmName: {
    type: String,
    required: false,
  },
  ageRestriction: {
    type: String,
    required: false,
  },
  date: {
    type: String,
    required: false,
  },
  time: {
    type: String,
    required: false,
  },
  roomName: {
    type: String,
    required: false,
  },
  seatNames: [{
    type: String,
  }, ],
  totalMoney: {
    type: Number,
    required: true,
  },
  tickets: [{
    name: {
      type: String,
      required: false,
    },
    quantity: {
      type: String,
      required: false,
    },
    unitPrice: {
      type: String,
      required: false,
    },
  }, ],
  items: [{
    name: {
      type: String,
      required: false,
    },
    quantity: {
      type: String,
      required: false,
    },
    unitPrice: {
      type: String,
      required: false,
    },
  }, ],
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
  printed: {
    type: Boolean,
    default: false,
  },
  served: {
    type: Boolean,
    default: false,
  },
  invalidReason_Printed: {
    type: String,
    default: "",
  },
  invalidReason_Served: {
    type: String,
    default: "",
  },
}, {
  timestamps: true,
});

const orderModel = mongoose.model("orders", orderSchema);
export default orderModel;
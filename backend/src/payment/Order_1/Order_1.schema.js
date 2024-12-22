import mongoose from "mongoose";

const order_1Schema = new mongoose.Schema({
  orderID: {
    type: mongoose.Types.ObjectId,
    required: true,
  },
  signature: {
    type: String,
    required: true,
  },
  ttl: {
    type: Date,
    default: () => new Date(Date.now() + 60 * 60 * 1000), // 1 hour from now
    index: { expireAfterSeconds: 0 }, // TTL index
  },
});

const order_1Model = mongoose.model("order_1", order_1Schema);
export default order_1Model;

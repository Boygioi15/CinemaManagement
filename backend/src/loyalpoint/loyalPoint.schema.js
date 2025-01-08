import mongoose from "mongoose";

const loyalPointSchema = new mongoose.Schema({
  customerRef: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  currentLoyalPoint: {
    type: Number,
  },
}, {
  timestamps: true,
});

const loyalPointModel = mongoose.model("loyalPoints", loyalPointSchema);
export default loyalPointModel;
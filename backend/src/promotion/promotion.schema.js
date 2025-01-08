import mongoose from "mongoose";

const promotionSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  thumbnailURL: {
    type: String,
    required: true
  },
  public_ID: {
    type: String,
    required: true
  },
  discountRate: {
    type: Number,
    required: true
  },
  paused: {
    type: Boolean,
    default: false
  },
  beginDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true
  }
}, {
  timestamps: true,
});

const promotionModel = mongoose.model("promotions", promotionSchema);
export default promotionModel;
import mongoose, { Schema } from "mongoose";

const additionalItemSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    thumbnailURL: {
      type: String,
      required: true,
    },
    public_ID: {
      type: String,
      required: true,
    },
    deleted: {
      type: Boolean,
      default: false,
    },
    loyalPointRate: {
      type: Number,
      default: 1,
    },
  },
  {
    timestamps: true,
  }
);

const additionalItemModel = mongoose.model(
  "additionalItems",
  additionalItemSchema
);
export default additionalItemModel;

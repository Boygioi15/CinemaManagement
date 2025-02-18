import mongoose, { Mongoose } from "mongoose";

const filmShowSchema = new mongoose.Schema(
  {
    roomId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "rooms",
    },
    showTime: {
      type: String,
      require: true,
    },
    showDate: {
      type: Date,
      require: true,
    },
    film: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "films",
    },
    lockedSeats: {
      type: [],
      default: [],
    },
    filmType: {
      type: String,
      enum: ["2D", "3D", "4D"],
      require: true,
    },
    cancelled: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const filmShowModel = mongoose.model("filmShows", filmShowSchema);
export default filmShowModel;

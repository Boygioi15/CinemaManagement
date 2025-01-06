import mongoose from "mongoose";

const AgeRestrictionSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
});

const ParamSchema = new mongoose.Schema({
  promotion_PointToReducedPriceRatio: {
    type: Number,
    default: 10,
  },
  promotion_PriceToPointRatio: {
    type: Number,
    default: 10,
  },
  addedPriceForCenterSeat: {
    type: Number,
    default: 10,
  },
  addedPriceForVIPSeat: {
    type: Number,
    default: 20,
  }
});



const TicketTypeSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  isPair: {
    type: Boolean,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
});

const ParamModel = mongoose.model(
  "params",
  ParamSchema
);

const AgeRestrictionModel = mongoose.model(
  "ageRestrictions",
  AgeRestrictionSchema
);
const TicketTypeModel = mongoose.model("ticketTypes", TicketTypeSchema);

export {
  AgeRestrictionModel,
  TicketTypeModel,
  ParamModel
};
import mongoose from "mongoose";

const AgeRestrictionSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
});

const ParamSchema = new mongoose.Schema({
  loyalPoint_OrderToPointRatio: {
    type: Number,
    default: 10,
  },
  loyalPoint_PointToReducedPriceRatio: {
    type: Number,
    default: 50,
  },
  loyalPoint_MiniumValueToUseLoyalPoint: {
    type: Number,
    default: 200000,
  },
  loyalPoint_MaxiumPointUseInOneGo: {
    type: Number,
    default: 50000,
  },
  maximumDiscountRate: {
    type: Number,
    default: 40,
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
  loyalPointRate: {
    type: Number,
    default: 1,
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
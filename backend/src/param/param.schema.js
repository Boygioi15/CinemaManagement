import mongoose from "mongoose";

const AgeRestrictionSchema = new mongoose.Schema({
  symbol: {
    type: String,
    required: true,
  },
  value: {
    type: String,
    required: true,
  },
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
const ParamSchema = new mongoose.Schema({});
const AgeRestrictionModel = mongoose.model(
  "ageRestrictions",
  AgeRestrictionSchema
);
const TicketTypeModel = mongoose.model("ticketTypes", TicketTypeSchema);

export { AgeRestrictionModel, TicketTypeModel };

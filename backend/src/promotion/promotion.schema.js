import mongoose from "mongoose";


const promotionSchema = new mongoose.Schema({
  discountRate: {},
  name: {},
  beginDate: {

  },
  endDate: {

  }

}, {
  timestamps: true,
});

const promotionModel = mongoose.model("promotions", promotionSchema);
export default promotionModel;
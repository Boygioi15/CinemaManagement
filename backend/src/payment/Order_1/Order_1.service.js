import expressAsyncHandler from "express-async-handler";
import mongoose from "mongoose";
import order_1Model from "./Order_1.schema.js";
export class Order_1Service {
  static createNewEntry = expressAsyncHandler(async (orderID, signature) => {
    await order_1Model.create({ orderID, signature });
  });
  static verifySignature = expressAsyncHandler(
    async (orderID, givenSignature) => {
      const order_1 = await order_1Model.find({
        orderID: orderID,
      });
      if (order_1.signature !== givenSignature) {
        return false;
      }
      return true;
    }
  );
}

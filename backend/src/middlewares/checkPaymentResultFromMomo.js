import expressAsyncHandler from "express-async-handler";
import { Order_1Service } from "../payment/Order_1/Order_1.service.js";
export const checkPaymentResultFromMomo = expressAsyncHandler(
  async (req, res, next) => {
    const { orderID, momo_signature } = req.body;
    if (!Order_1Service.verifySignature(orderID, momo_signature)) {
      throw new Error("Signature mismatch. Potential attack identified");
    }
    console.log("Signature matched");
    next();
  }
);

import express from "express";
import paymentController from "./payment.controller.js";
import { checkOrderRequestComingFromFrontend } from "../middlewares/checkOrderRequestComingFromFrontend.js";
import { checkPaymentResultFromMomo } from "../middlewares/checkPaymentResultFromMomo.js";

const router = express.Router();

// Routes cho ticket
router.post(
  "",
  checkOrderRequestComingFromFrontend,
  paymentController.createPayment
);
router.post(
  "/callback",
  checkPaymentResultFromMomo,
  paymentController.momoCallBack
);
router.get("/transaction-status/:id", paymentController.getTransactionStatus);
export default router;

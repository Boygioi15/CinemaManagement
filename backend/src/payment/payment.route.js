import express from "express";
import paymentController from "./payment.controller.js";
import {
    checkOutTicket
} from "../middlewares/checkorder.js";

const router = express.Router();

// Routes cho ticket
router.post("", checkOutTicket, paymentController.createPayment);
router.post("/callback", paymentController.callback);



export default router;
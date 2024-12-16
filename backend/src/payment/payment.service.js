import config from "./config.js";
import crypto from "crypto";
import axios from "axios";
import { TicketService } from "../ticket/ticket.service.js";
import mongoose from "mongoose";
import { Order_1Service } from "./Order_1/Order_1.service.js";
import { FilmService } from "../film/film.service.js";
import { FilmShowService } from "../filmShow/filmShow.service.js";

export class PaymentService {
  static createPayment = async (req, res) => {
    try {
      const totalPrice = req.body.totalPrice || 0;
      const {
        accessKey,
        secretKey,
        partnerCode,
        redirectUrl,
        ipnUrl,
        requestType,
        autoCapture,
        lang,
      } = config;

      const transactionData = req.body || {};
      const amount = totalPrice;

      // Ensure all required fields are present and valid
      if (!amount || amount <= 0) {
        return res.status(400).json({
          statusCode: 400,
          message: "Invalid amount",
        });
      }

      const orderId = new mongoose.Types.ObjectId();
      const requestId = orderId;

      // Prepare signature components carefully
      const rawSignature = [
        `accessKey=${accessKey}`,
        `amount=${amount}`,
        `extraData=${JSON.stringify(transactionData)}`,
        `ipnUrl=${ipnUrl}`,
        `orderId=${orderId}`,
        `orderInfo=${"Thanh toán vé xem phim với MOMO"}`,
        `partnerCode=${partnerCode}`,
        `redirectUrl=${redirectUrl}`,
        `requestId=${requestId}`,
        `requestType=${requestType}`,
      ].join("&");
      //console.log(rawSignature);
      // Create signature

      const signature = crypto
        .createHmac("sha256", secretKey)
        .update(rawSignature)
        .digest("hex");

      const requestBody = JSON.stringify({
        partnerCode,
        partnerName: "Nhóm 22 - Quản lý hệ thống rạp chiếu phim",
        storeId: "CinemaStore",
        requestId,
        amount,
        orderId,
        orderInfo: "Thanh toán vé xem phim với MOMO",
        redirectUrl,
        ipnUrl,
        lang,
        requestType,
        autoCapture,
        extraData: JSON.stringify(transactionData), // Ensure it's a string
        signature,
      });

      // Axios request with error handling
      const result = await axios({
        method: "POST",
        url: "https://test-payment.momo.vn/v2/gateway/api/create",
        headers: {
          "Content-Type": "application/json",
          "Content-Length": Buffer.byteLength(requestBody),
        },
        data: requestBody,
      });
      Order_1Service.createNewEntry(orderId, signature);
      return res.status(200).json(result.data);
    } catch (error) {
      console.error(
        "Payment Creation Error:",
        error.response?.data || error.message
      );

      return res.status(500).json({
        statusCode: 500,
        message: error.response?.data?.message || error.message,
      });
    }
  };
  static callbackService = async (req, res) => {
    const { resultCode, amount, orderId, extraData } = req.body;
    console.log(req.body);
    const extraDataObj = JSON.parse(extraData);
    //success
    if (resultCode === 0) {
      try {
        const newTicket = await TicketService.createTicketOrder(extraDataObj);

        return res.status(204).json(newTicket);
      } catch (error) {
        console.log("🚀 ~ PaymentService ~ callbackService= ~ error:", error);
      }
    } else {
      // fail
      const {
        customerInfo,
        tickets,
        filmShowId,
        seats,
        additionalItems,
        totalPrice,
      } = extraDataObj;

      FilmShowService.releaseLockedSeats(filmShowId, seats);
    }

    return res.status(204).json(req.body);
  };
}

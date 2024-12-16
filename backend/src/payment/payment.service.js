import config from "./config.js";
import crypto from "crypto";
import axios from "axios";
import { OrderService } from "../order/order.service.js";
import mongoose from "mongoose";
import { Order_1Service } from "./Order_1/Order_1.service.js";
import { FilmShowService } from "../filmShow/filmShow.service.js";
import { EmailService } from "../email/email.service.js";
import expressAsyncHandler from "express-async-handler";
import orderModel from "../order/order.schema.js";
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
      let rawSignature = [
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
      await Order_1Service.createNewEntry(orderId, signature);

      const { filmShowId, seats } = req.body;
      await FilmShowService.appendLockedSeats(filmShowId, seats);
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
  static momoCallBackService = async (req, res) => {
    const { resultCode, amount, orderId, extraData } = req.body;

    const extraDataObj = JSON.parse(extraData);
    //success
    if (resultCode === 0) {
      // create order
      try {
        const newOrder = await OrderService.createOrder(extraDataObj);
        if (!newOrder) throw customError("Tạo đơn hàng thất bại");
        // cuưa dăng nhap ma mua

        if (!newOrder.customerID) {
          await EmailService.sendEmailWithHTMLTemplate(
            newOrder.customerInfo.email,
            "Thư xác nhận đơn hàng",
            newOrder1
          );
        } else {
          // user da dăng nhap
          const user = await userModel.findById(newOrder.customerID);
          await EmailService.sendEmailWithHTMLTemplate(
            user.userEmail,
            "Thư xác nhận đơn hàng",
            newOrder1
          );
        }
        return res.status(204).json(newOrder);
      } catch (error) {
        console.log("🚀 ~ PaymentService ~ callbackService= ~ error:", error);
        const { filmShowId, seats } = extraDataObj;
        await FilmShowService.releaseLockedSeats(filmShowId, seats);
      }
    } else {
      // fail
      const { filmShowId, seats } = extraDataObj;
      await FilmShowService.releaseLockedSeats(filmShowId, seats);
    }

    return res.status(204).json(req.body);
  };
  static getTransactionStatus = expressAsyncHandler(async (id) => {
    return await orderModel.findById(id);
  });
}

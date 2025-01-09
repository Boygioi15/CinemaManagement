import config from "./config.js";
import crypto from "crypto";
import axios from "axios";
import { OrderService } from "../order/order.service.js";
import mongoose from "mongoose";
import { Order_1Service } from "./Order_1/Order_1.service.js";
import { FilmShowService } from "../filmShow/filmShow.service.js";
import { EmailService } from "../email/email.service.js";
import expressAsyncHandler from "express-async-handler";
import { orderModel } from "../order/order.schema.js";
import promotionModel from "../promotion/promotion.schema.js";
export class PaymentService {
  static createPayment = async (req, res) => {
    try {
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
      if (transactionData.seatSelections) {
        const filteredSeat = [];
        for (let i = 0; i < transactionData.seatSelections.length; i++) {
          for (let j = 0; j < transactionData.seatSelections[0].length; j++) {
            if (transactionData.seatSelections[i][j].selected) {
              const newSeat = transactionData.seatSelections[i][j];
              newSeat.i = i;
              newSeat.j = j;
              filteredSeat.push(newSeat);
            }
          }
        }
        transactionData.seatSelections = filteredSeat;
      }

      let amount = req.body.totalPriceAfterDiscount || req.body.totalPrice;
      console.log("🚀 ~ PaymentService ~ createPayment= ~ amount:", amount);

      // Ensure all required fields are present and valid
      if (!amount || amount <= 0) {
        return res.status(400).json({
          statusCode: 400,
          message: "Invalid amount",
        });
      }
      let roundedAmount = Math.floor(amount);
      const orderId = new mongoose.Types.ObjectId();
      const requestId = orderId;

      // Prepare signature components carefully
      let rawSignature = [
        `accessKey=${accessKey}`,
        `amount=${roundedAmount}`,
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
        amount: roundedAmount,
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
      console.log(result);
      await Order_1Service.createNewEntry(orderId, signature);

      const { filmShowId, seatSelections } = req.body;
      console.log(
        "🚀 ~ PaymentService ~ createPayment= ~ seatSelections:",
        seatSelections
      );

      if (filmShowId && seatSelections) {
        await FilmShowService.appendLockedSeats(filmShowId, seatSelections);
      }

      return res.status(200).json(result.data);
    } catch (error) {
      console.error(
        "Payment Creation Error:",
        error,
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
        console.log("Here is your order:");
        console.log(extraDataObj);
        const newOrder = await OrderService.createOrder(extraDataObj);
        if (!newOrder) throw customError("Tạo đơn hàng thất bại");
        // cuưa dăng nhap ma mua

        // user da dăng nhap
        const orderDetail = await OrderService.getDetailOrder(newOrder._id);

        await EmailService.sendEmailWithHTMLTemplate(
          newOrder.customerInfo.email,
          "Thư xác nhận đơn hàng",
          orderDetail?.data
        );

        return res.status(204).json(newOrder);
      } catch (error) {
        const { filmShowId, seatSelections } = extraDataObj;
        if (filmShowId && seatSelections) {
          await FilmShowService.releaseLockedSeats(filmShowId, seatSelections);
        }
      }
    } else {
      // fail
      const { filmShowId, seatSelections } = extraDataObj;
      if (filmShowId && seatSelections) {
        await FilmShowService.releaseLockedSeats(filmShowId, seatSelections);
      }
    }

    return res.status(204).json(req.body);
  };
  static getTransactionStatus = expressAsyncHandler(async (id) => {
    return await orderModel.findById(id);
  });
}

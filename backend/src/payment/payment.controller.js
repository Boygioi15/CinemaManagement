import expressAsyncHandler from "express-async-handler";
import {
  PaymentService
} from "./payment.service.js";

class PaymentController {
  checkOrderRequestComingFromFrontend = expressAsyncHandler(
    async (req, res) => {
      try {
        const response =
          await PaymentService.checkOrderRequestComingFromFrontend(req.body);

        res.status(200).json(response);
      } catch (error) {
        res.status(500).json({
          error: error.message,
        });
      }
    }
  );

  createPayment = expressAsyncHandler(async (req, res) => {
    try {
      await PaymentService.createPayment(req, res);
    } catch (error) {
      res.status(500).json({
        error: error.message,
      });
    }
  });

  getTransactionStatus = expressAsyncHandler(async (req, res) => {
    const {
      id
    } = req.params;
    const order = await PaymentService.getTransactionStatus(id);
    if (!order) {
      res.status(404).json({
        msg: "Không tìm thấy đơn hàng",
      });
      return;
    }
    res.status(200).json(order);
  });
  momoCallBack = expressAsyncHandler(async (req, res) => {
    await PaymentService.momoCallBackService(req, res);
  });
}
export default new PaymentController();
import expressAsyncHandler from "express-async-handler";
import {
    PaymentService
} from "./payment.service.js";

class PaymentController {
    checkOutTicket = expressAsyncHandler(async (req, res) => {
        try {
            const response = await PaymentService.checkOutTicket(req.body);

            res.status(200).json(response);
        } catch (error) {
            res.status(500).json({
                error: error.message
            });
        }
    });

    createPayment = expressAsyncHandler(async (req, res) => {
        try {
            await PaymentService.createPayment(req, res);
        } catch (error) {
            res.status(500).json({
                error: error.message
            });
        }
    });

    callback = expressAsyncHandler(async (req, res) => {
        try {
            await PaymentService.callbackService(req, res);
        } catch (error) {
            res.status(500).json({
                error: error.message
            });
        }
    });
}
export default new PaymentController();
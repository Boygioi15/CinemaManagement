import config from "./config.js";
import crypto from "crypto"
import axios from "axios"
import {
    TicketService
} from "../ticket/ticket.service.js";

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

            const checkoutData = req.body || {};
            const amount = totalPrice;

            // Ensure all required fields are present and valid
            if (!amount || amount <= 0) {
                return res.status(400).json({
                    statusCode: 400,
                    message: 'Invalid amount'
                });
            }

            const orderId = `${partnerCode}_${Date.now()}`;
            const requestId = orderId;

            // Prepare signature components carefully
            const rawSignature = [
                `accessKey=${accessKey}`,
                `amount=${amount}`,
                `extraData=${JSON.stringify(checkoutData)}`,
                `ipnUrl=${ipnUrl}`,
                `orderId=${orderId}`,
                `orderInfo=${checkoutData.orderInfo || 'Cinema Ticket Purchase'}`,
                `partnerCode=${partnerCode}`,
                `redirectUrl=${redirectUrl}`,
                `requestId=${requestId}`,
                `requestType=${requestType}`
            ].join('&');

            // Create signature
            const signature = crypto
                .createHmac('sha256', secretKey)
                .update(rawSignature)
                .digest('hex');

            // Construct request body with careful JSON serialization
            const requestBody = JSON.stringify({
                partnerCode,
                partnerName: 'Cinema Ticket Service',
                storeId: 'CinemaStore',
                requestId,
                amount,
                orderId,
                orderInfo: 'Cinema Ticket Purchase',
                redirectUrl,
                ipnUrl,
                lang,
                requestType,
                autoCapture,
                extraData: JSON.stringify(checkoutData), // Ensure it's a string
                signature,
            });

            // Axios request with error handling
            const result = await axios({
                method: 'POST',
                url: 'https://test-payment.momo.vn/v2/gateway/api/create',
                headers: {
                    'Content-Type': 'application/json',
                    'Content-Length': Buffer.byteLength(requestBody),
                },
                data: requestBody,
            });

            return res.status(200).json(result.data);

        } catch (error) {
            console.error('Payment Creation Error:', error.response?.data || error.message);
            return res.status(500).json({
                statusCode: 500,
                message: error.response?.data?.message || error.message
            });
        }
    }
    n
    static callbackService = async (req, res) => {
        const {
            resultCode,
            amount,
            orderId,
            extraData
        } = req.body;

        const extraDataObj = JSON.parse(extraData);
        //success
        if (resultCode === 0) {
            // create order
            try {
                const newTicket = await TicketService.createTicketOrder(extraDataObj)

                return res.status(204).json(newTicket);

            } catch (error) {
                console.log("🚀 ~ PaymentService ~ callbackService= ~ error:", error)

            }
        } else {
            // fail
            const {
                customerInfo,
                tickets,
                filmShowId,
                seats,
                additionalItems,
                totalPrice
            } = extraDataObj;

            // open lock seat
            const fimlShowId = await filmShowModel.findById(filmShowId);
            if (!fimlShowId) throw customError("Filmshow not found ", 400)

            filmShow.locketSeatIds = filmShow.locketSeatIds.filter(seatId => !seats.includes(seatId));

            await filmShowModel.save();

        }

        return res.status(204).json(req.body);
    }
}
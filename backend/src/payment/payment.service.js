import config from "./config.js";
import crypto from "crypto"
import axios from "axios"

export class PaymentService {
    static createPayment = async (req, res) => {
        const {
            totalPrice
        } = req.checkoutData
        console.log("🚀 ~ PaymentService ~ createPayment= ~ totalPrice:", totalPrice)

        let {
            accessKey,
            secretKey,
            orderInfo,
            partnerCode,
            redirectUrl,
            ipnUrl,
            requestType,
            extraData,
            orderGroupId,
            autoCapture,
            lang,
        } = config;

        var amount = totalPrice;
        console.log("🚀 ~ PaymentService ~ createPayment= ~ amount:", amount)
        var orderId = partnerCode + new Date().getTime();
        var requestId = orderId;

        var rawSignature =
            'accessKey=' +
            accessKey +
            '&amount=' +
            amount +
            '&extraData=' +
            extraData +
            '&ipnUrl=' +
            ipnUrl +
            '&orderId=' +
            orderId +
            '&orderInfo=' +
            orderInfo +
            '&partnerCode=' +
            partnerCode +
            '&redirectUrl=' +
            redirectUrl +
            '&requestId=' +
            requestId +
            '&requestType=' +
            requestType;

        //signature
        var signature = crypto
            .createHmac('sha256', secretKey)
            .update(rawSignature)
            .digest('hex');

        const requestBody = JSON.stringify({
            partnerCode: partnerCode,
            partnerName: 'Test',
            storeId: 'MomoTestStore',
            requestId: requestId,
            amount: amount,
            orderId: orderId,
            orderInfo: orderInfo,
            redirectUrl: redirectUrl,
            ipnUrl: ipnUrl,
            lang: lang,
            requestType: requestType,
            autoCapture: autoCapture,
            extraData: req.checkoutData,
            orderGroupId: orderGroupId,
            signature: signature,
        });
        const options = {
            method: 'POST',
            url: 'https://test-payment.momo.vn/v2/gateway/api/create',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(requestBody),
            },
            data: requestBody,
        };

        // Send the request and handle the response
        let result;
        try {
            result = await axios(options);
            return res.status(200).json(result.data);
        } catch (error) {
            return res.status(500).json({
                statusCode: 500,
                message: error.stack
            });
        }
    }

    static callbackService = async (req, res) => {
        const {
            resultCode,
            amount,
            orderId,
            extraData
        } = req.body;
        console.log("🚀 ~ PaymentService ~ callbackService= ~ extraData:", extraData)

        return res.status(204).json(req.body);
    }
}
require('dotenv').config();
const twilio = require('twilio');

const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

async function sendOTPMessage(userPhone, otp) {
    try {
        const message = await client.messages.create({
            body: `Mã xác thực Web_Cinema của bạn là: ${otp}`,
            from: process.env.TWILIO_PHONE_NUMBER,  // Số điện thoại Twilio của bạn
            to: userPhone,  // Số điện thoại người nhận (userPhone)
        });
        console.log("OTP sent:", message.sid);
        return true;
    } catch (error) {
        console.error("Error sending OTP:", error);
        return false;
    }
}

module.exports = { sendOTPMessage };

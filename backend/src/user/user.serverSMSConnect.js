import dotenv from "dotenv";
dotenv.config();
import twilio from "twilio";

const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

async function sendOTPMessage(userPhone, otp) {
    try {
        const message = await client.messages.create({
            body: `Mã xác thực Web_Cinema của bạn là: ${otp}`,
            from: process.env.TWILIO_PHONE_NUMBER,
            to: userPhone, 
        });
        console.log("OTP sent:", message.sid);
        return true;
    } catch (error) {
        console.error("Error sending OTP:", error);
        return false;
    }
}

export default sendOTPMessage;

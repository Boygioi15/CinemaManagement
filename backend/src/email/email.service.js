import userModel from "../user/user.schema.js";
import transporter from "./email.config.js";

export class EmailService {
    static sendEmail = async (to, subject, text) => {
        try {
            await transporter.sendMail({
                from: process.env.EMAIL_USER,
                to: to,
                subject: subject,
                text: text,
            });
            console.log("Email sent successfully!");
            return true;
        } catch (error) {
            console.error("Error sending email:", error.message);
            return false;
        }
    };

    static storeConfirmCode = async (userEmail, verification) => {
        const expirationTime = new Date(Date.now() + 3 * 60 * 1000); // 3 phút từ thời điểm gửi mã
        return await userModel.findOneAndUpdate({
            userEmail
        }, {
            userVerificationCode: verification,
            userVFCodeExpirationTime: expirationTime,
        }, {
            new: true
        });
    };
}
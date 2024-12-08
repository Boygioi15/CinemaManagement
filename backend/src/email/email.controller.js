import {
    UserService
} from "../user/user.service.js";
import {
    EmailService
} from "./email.service.js";
import expressAsyncHandler from "express-async-handler";

class EmailController {
    sendConfirmCode = expressAsyncHandler(async (req, res, next) => {
        const {
            userEmail
        } = req.body;

        const user = await UserService.findUserByEmail(userEmail);
        if (!user) {
            return res.status(404).json({
                msg: "User not found",
                success: false
            });
        }

        const randomVerificationCode = () => {
            const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
            let code = "";
            for (let i = 0; i < 6; i++) {
                const randomIndex = Math.floor(Math.random() * characters.length);
                code += characters[randomIndex];
            }
            return code;
        };

        const verificationCode = randomVerificationCode();
        await EmailService.sendEmail(userEmail, "Verification Code", `Your verification code is: ${verificationCode}`);
        await EmailService.storeConfirmCode(userEmail, verificationCode);

        return res.status(200).json({
            msg: "Verification code sent successfully!",
            success: true
        });
    });

    checkConfirmCode = expressAsyncHandler(async (req, res, next) => {
        const {
            userEmail,
            userVerificationCode
        } = req.body;

        const user = (await UserService.findUserByEmail(userEmail));
        if (!user) {
            return res.status(404).json({
                msg: "User not found!",
                success: false
            });
        }

        if (user.userVerificationCode !== userVerificationCode || user.userVFCodeExpirationTime < new Date()) {
            return res.status(404).json({
                msg: "Invalid verification code!",
                success: false
            });
        }

        user.userIsConfirmed = true;
        await user.save();

        return res.status(200).json({
            msg: "Confirmed successfully!",
            success: true
        });
    });

}

export default new EmailController();
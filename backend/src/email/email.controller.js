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

    testSendMailWithTemplate = expressAsyncHandler(async (req, res, next) => {

        const ticket = {
            verifyCode: "145910772",
            filmName: "BONG DUNG TRUNG SO C13",
            time: "10:10",
            date: "06-10-2022",
            roomName: "SỐ 01",
            seatNames: ["A1", "A2", "A3"],
            items: [{
                    name: "Popcorn",
                    quantity: 2,
                    price: 50000
                },
                {
                    name: "Coke",
                    quantity: 1,
                    price: 30000
                },
            ],
            totalMoney: 130000,
        };

        await EmailService.sendEmailWithHTMLTemplate("hoangphonghp04@gmail.com", "Vé phim", ticket)
        return res.status(200).json({
            msg: "Confirmed successfully!",
            success: true
        });
    });
}

export default new EmailController();
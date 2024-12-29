import expressAsyncHandler from "express-async-handler";
import {
    AuthService
} from "./auth.service.js";

class AuthController {
    signUp = expressAsyncHandler(async (req, res, next) => {
        const response = await AuthService.signUp(req.body);
        return res.status(200).json({
            msg: "User created successfully!",
            success: true,
            data: response,
        });
    })

    signIn = expressAsyncHandler(async (req, res, next) => {
        const response = await AuthService.signIn(req.body);
        res.cookie("refresh_token", response.tokens.refreshToken, {
            httpOnly: true,
            maxAge: 60 * 60 * 1000,
        });

        return res.status(200).json({
            msg: "User created successfully!",
            success: true,
            data: response,
        });
    })

    signOut = expressAsyncHandler(async (req, res, next) => {
        res.clearCookie('refresh_token');
        return res.status(200).json({
            msg: "Logout success",
            success: true,

        });
    })

    handleRefreshToken = expressAsyncHandler(async (req, res, next) => {
        const refreshToken = req.cookies?.refresh_token;
        const response = await AuthService.processNewToken(refreshToken);


        res.cookie("refresh_token", response.tokens.refreshToken, {
            httpOnly: true,
            maxAge: 60 * 60 * 1000,
        });

        return res.status(200).json({
            msg: "Process new token successfully!",
            success: true,
            data: response,
        });
    })

    fetchAccount = expressAsyncHandler(async (req, res, next) => {
        return res.status(200).json({
            msg: "Fetch account successfully!",
            success: true,
            data: await AuthService.fetchAccount(req),
        });
    })
}

export default new AuthController();
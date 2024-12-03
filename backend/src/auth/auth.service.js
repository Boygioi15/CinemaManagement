import {
    customError
} from "../middlewares/errorHandlers.js";
import userModel from "../user/user.schema.js";
import {
    UserService
} from "../user/user.service.js";
import {
    JwtService
} from "./jwt/jwt.service.js";
import bcrypt from "bcrypt";

export class AuthService {
    static signUp = async (userdata) => {
        const {
            userEmail,
            userPhone
        } = userdata;

        const existingUserPhone = await UserService.findUserByPhone(userPhone);
        if (existingUserPhone) {
            throw customError("Phone number already registered!", 400);
        }

        const existingUserEmail = await UserService.findUserByEmail(userEmail);
        if (existingUserEmail) {
            throw customError("Email already registered!", 400);

        }

        return await userModel.create(userdata);
    };
    static signIn = async ({
        identifier,
        userPass,
    }) => {
        const user = await UserService.checkExitAndActiveUser(identifier);
        if (!user) {
            throw customError("User not found", 400);
        }
        const isMatch = AuthService.checkPassword(userPass, user.userPass);
        if (!isMatch) {
            throw customError("Password is incorrect", 400);
        }
        let payload = {
            id: user._id,
            username: user.userName,
            email: user.userEmail,
            phone: user.userPhone
        };
        let tokens = JwtService.createJWT(payload);

        return {
            email: user.userEmail,
            username: user.userName,
            tokens,
        }
    };
    static processNewToken = async (refreshToken) => {
        const decoded = JwtService.verifyRTToken(refreshToken);

        if (!decoded) {
            throw customError("Invalid or expired refresh token", 403);
        }
        const payload = {
            id: decoded.id,
            username: decoded.username,
            email: decoded.email,
            phone: decoded.phone
        };

        const newTokens = JwtService.createJWT(payload)

        return {
            email: decoded.email,
            phone: decoded.phone,
            username: decoded.username,
            tokens: newTokens,
        }
    }
    static checkPassword = (inputPassword, hashPassword) => {
        return bcrypt.compareSync(inputPassword, hashPassword); // true
    };
}
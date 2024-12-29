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
            password,
            confirmPassword,
            phone,
            email
        } = userdata;

        if (password !== confirmPassword) {
            throw customError("Mật khẩu không khớp ", 400);
        }

        const existingUserPhone = await UserService.findUserByPhone(phone);
        if (existingUserPhone) {
            throw customError("Phone number already registered!", 400);
        }

        const existingUserEmail = await UserService.findUserByEmail(email);
        if (existingUserEmail) {
            throw customError("Email already registered!", 400);

        }

        return await userModel.create(userdata);

    };

    static signIn = async ({
        identifier,
        userPass,
    }) => {
        const user = await UserService.checkExitAndBlockedUser(identifier);
        if (!user) {
            throw customError("User not found", 400);
        }
        const isMatch = AuthService.checkPassword(userPass, user.password);
        if (!isMatch) {
            throw customError("Password is incorrect", 400);
        }
        let payload = {
            id: user._id,
            name: user.name,
            email: user.email,
            phone: user.phone,
            birth: user.birth
        };
        let tokens = JwtService.createJWT(payload);

        return {
            id: user._id,
            name: user.name,
            email: user.email,
            phone: user.phone,
            birth: user.birth,
            tokens,
        }
    };

    static processNewToken = async (refreshToken) => {
        const decoded = JwtService.verifyRTToken(refreshToken);

        if (!decoded) {
            throw customError("Invalid or expired refresh token", 403);
        }
        const payload = {
            id: decoded._id,
            name: decoded.name,
            email: decoded.email,
            phone: decoded.phone,
            birth: decoded.birth
        };

        const newTokens = JwtService.createJWT(payload)

        return {
            id: decoded.id,
            name: decoded.name,
            email: decoded.email,
            phone: decoded.phone,
            birth: decoded.birth,
            tokens: newTokens,
        }
    }

    static checkPassword = (inputPassword, hashPassword) => {
        return bcrypt.compareSync(inputPassword, hashPassword); // true
    };

    static fetchAccount = async (req) => {
        const accessToken = this.getAccessTokenFromHeader(req);
        if (!accessToken)
            throw customError("Invalid or expired access token", 401)

        const decoded = JwtService.verifyATToken(accessToken);

        if (!decoded) {
            throw customError("Invalid or expired access token", 401);
        }

        const user = await userModel.findById(decoded.id)

        const payload = {
            id: user.id,
            name: user.name,
            email: user.email,
            phone: user.phone,
            birth: user.birth,
        };

        return {
            ...payload
        }
    }

    static getAccessTokenFromHeader(req) {
        const authHeader = req.headers['authorization'];

        if (authHeader && authHeader.startsWith('Bearer ')) {
            return authHeader.split(' ')[1];
        } else {
            return null;
        }
    }
}
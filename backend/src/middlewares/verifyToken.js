import expressAsyncHandler from "express-async-handler";
import {
  JwtService
} from "../auth/jwt/jwt.service.js";
import userModel from "../user/user.schema.js";
import {
  customError
} from "./errorHandlers.js";

const validateToken = expressAsyncHandler(async function (req, res, next) {
  let authHeader = req?.headers?.authorization;
  if (!authHeader) {
    throw customError("There is no token inside request!", 401);
  }
  if (authHeader.startsWith("Bearer")) {
    const token = authHeader.split(" ")[1];
    try {
      const decoded = JwtService.verifyATToken(token)
      const user = await userModel.findById(decoded?.id);
      req.user = user;
      next();
    } catch (error) {
      throw new Error(error);
    }
  } else {
    throw new Error("There is no token inside request!");
  }
});
const checkIsAdmin = expressAsyncHandler(async function (req, res, next) {
  const user = req.user;
  if (user.role === "admin") {
    next();
  } else {
    throw new Error("You are not permitted!");
  }
});
export {
  validateToken,
  checkIsAdmin
};
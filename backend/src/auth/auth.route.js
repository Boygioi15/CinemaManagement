import express from "express";
import {
  user_AuthController,
  employee_AuthController,
} from "./auth.controller.js";
import { validateToken } from "../middlewares/verifyToken.js";

const router = express.Router();

router.post("/user/sign-in", user_AuthController.signIn);
router.post("/user/sign-up", user_AuthController.signUp);
router.get("/user/sign-out", user_AuthController.signOut);
router.post("/user/refresh-token", user_AuthController.handleRefreshToken);
router.get("/user/account", validateToken, user_AuthController.fetchAccount);

router.post(
  "/employee/validateJWT",
  validateToken,
  employee_AuthController.validateJWT
);
router.post("/employee/log-in", employee_AuthController.signIn);
router.get("/employee/sign-out", employee_AuthController.signOut);

export default router;

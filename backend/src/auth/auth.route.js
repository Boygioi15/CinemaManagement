import express from "express";
import authController from "./auth.controller.js";
import {
    validateToken
} from "../middlewares/verifyToken.js";

const router = express.Router();

router.post("/sign-in", authController.signIn);
router.post("/sign-up", authController.signUp);
router.get("/sign-out", authController.signOut);
router.post("/refresh-token", authController.handleRefreshToken);
router.get("/account", validateToken, authController.fetchAccount);


export default router;
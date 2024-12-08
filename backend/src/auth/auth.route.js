import express from "express";
import authController from "./auth.controller.js";

const router = express.Router();

router.post("/sign-in", authController.signIn);
router.post("/sign-up", authController.signUp);
router.post("/sign-out", authController.signOut);
router.post("/refresh-token", authController.handleRefreshToken);


export default router;
import express from "express";
import userRouter from "./user/user.route.js";
import authRouter from "./auth/auth.route.js";
import emailRouter from "./email/email.route.js";

const router = express.Router();

router.use("/api/auth", authRouter);
router.use("/api/user", userRouter);
router.use("/api/email", emailRouter);


router.use("/", (req, res) => {
  res.send("Hello there");
});

export default router;
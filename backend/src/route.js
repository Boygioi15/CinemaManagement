import express from "express";
import userRouter from "./user/user.route.js";
const router = express.Router();

router.use("/api/user", userRouter);
router.use("/", (req, res) => {
  res.send("Hello there");
});

export default router;

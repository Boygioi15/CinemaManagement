import express from "express";
import userRouter from "./user/user.route.js";
import authRouter from "./auth/auth.route.js";
import emailRouter from "./email/email.route.js";
import filmRouter from "./film/film.route.js";
import tagRouter from "./tag/tag.route.js";
import filmShowRouter from "./filmShow/filmShow.route.js";
import roomRouter from "./room/room.route.js";
import orderRouter from "./order/order.route.js";
import paramRouter from "./param/param.route.js";
import debugRouter from "./debug/debug.route.js";
import statisticRouter from "./statistic/statistic.route.js";
import promotionRouter from "./promotion/promotion.route.js";
import additionalItemRouter from "./additionalItem/additionalItem.route.js";
import paymentRouter from "./payment/payment.route.js";
import permissionRouter from "./permission/permission.route.js";

const router = express.Router();

router.use("/api/auth", authRouter);
router.use("/api/user", userRouter);
router.use("/api/email", emailRouter);
router.use("/api/films", filmRouter);
router.use("/api/tags", tagRouter);
router.use("/api/film-show", filmShowRouter);
router.use("/api/rooms", roomRouter);
router.use("/api/orders", orderRouter);
router.use("/api/additional-items", additionalItemRouter);
router.use("/api/payment", paymentRouter);
router.use("/api/param", paramRouter);
router.use("/api/debug", debugRouter);
router.use("/api/statistics", statisticRouter);
router.use("/api/promotion", promotionRouter);
router.use("/api/permission", permissionRouter);
router.use((req, res) => {
  res.status(404).json({ success: false, message: "Not found route" });
});

export default router;

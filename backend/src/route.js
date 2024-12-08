import express from "express";
import userRouter from "./user/user.route.js";
import authRouter from "./auth/auth.route.js";
import emailRouter from "./email/email.route.js";
import filmRouter from "./film/film.route.js";
import tagRouter from "./tag/tag.route.js";
import filmShowRouter from "./filmShow/filmShow.route.js";
import roomRouter from "./room/room.route.js";
import seatRouter from "./seat/seat.route.js";
import ticketRouter from "./ticket/ticket.route.js";
import orderRouter from "./order/order.route.js";




const router = express.Router();

router.use("/api/auth", authRouter);
router.use("/api/user", userRouter);
router.use("/api/email", emailRouter);
router.use("/api/films", filmRouter);
router.use("/api/tags", tagRouter);
router.use("/api/film-show", filmShowRouter);
router.use("/api/rooms", roomRouter);
router.use("/api/seats", seatRouter);
router.use("/api/tickets", ticketRouter);
router.use("/api/orders", orderRouter);


router.use((req, res) => {
  res.status(404).send("Not found route");
});

export default router;
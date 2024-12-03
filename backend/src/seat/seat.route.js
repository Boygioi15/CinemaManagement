import express from "express";
import seatController from "./seat.controller.js";


const router = express.Router();

router.post("", seatController.createSeat);

export default router;
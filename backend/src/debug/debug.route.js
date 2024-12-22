import express from "express";
import debugImplement from "./debug.implement.js";

const router = express.Router();

// Routes cho ticket
router.post("/order/reset", debugImplement.resetOrderAll);
router.post("/order/reset/:id", debugImplement.resetOrderID);

export default router;

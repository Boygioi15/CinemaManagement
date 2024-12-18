import express from "express";
import OrderController from "./order.controller.js";

const router = express.Router();

// Routes cho ticket
router.post("/", OrderController.createOrder);
router.get("/", OrderController.getAllOrders);
router.get("/:_id", OrderController.getOrderById);
router.put("/:_id/cancel", OrderController.disapproveOrder);
router.put("/:_id/print", OrderController.markOrderPrinted);
router.put("/:_id/serve", OrderController.markOrderServed);

export default router;

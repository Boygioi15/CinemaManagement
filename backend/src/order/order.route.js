import express from "express";
import OrderController from "./order.controller.js";
import {
  validateToken
} from "../middlewares/verifyToken.js";

const router = express.Router();

// Routes cho ticket
router.post("/", OrderController.createOrder);
router.get("/", OrderController.getAllOrders);
router.get(
  "/all-order-by-userId",
  validateToken,
  OrderController.getAllOrdersByUserId
);
router.get("/:_id", OrderController.getOrderById);
router.put("/:_id/disapprove-print", OrderController.disapprovePrinted);
router.put("/:_id/disapprove-serve", OrderController.disapproveServed);

router.put("/:_id/print", OrderController.markOrderPrinted);
router.put("/:_id/serve", OrderController.markOrderServed);

export default router;
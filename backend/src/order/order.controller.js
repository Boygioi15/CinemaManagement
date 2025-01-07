import {
  OrderHelper,
  OrderService
} from "./order.service.js";
import expressAsyncHandler from "express-async-handler";

class OrderController {
  createOrder = expressAsyncHandler(async (req, res) => {
    const order = req.body;
    try {
      const newOrder = await OrderService.createOrder(order);
      res.status(201).json(newOrder);
    } catch (error) {
      res.status(500).json({
        error: error.message,
      });
    }
  });

  getAllOrders = expressAsyncHandler(async (req, res) => {
    try {
      const orders = await OrderService.getAllOrders();
      res.status(200).json(orders);
    } catch (error) {
      res.status(500).json({
        error: error.message,
      });
    }
  });

  getOrderById = expressAsyncHandler(async (req, res) => {
    const {
      _id
    } = req.params;
    try {
      const order = await OrderService.getDetailOrder(_id);
      if (!order) {
        return res.status(404).json({
          error: "Order not found!",
        });
      }
      res.status(200).json(order);
    } catch (error) {
      res.status(500).json({
        error: error.message,
      });
    }
  });

  disapprovePrinted = expressAsyncHandler(async (req, res) => {
    const {
      _id
    } = req.params;
    const {
      reason
    } = req.body;

    if (!reason) {
      return res.status(400).json({
        error: "Phải nêu rõ lý do từ chối in vé",
      });
    }

    const order = await OrderHelper.disapprovePrinted(_id, reason);
    if (!order) {
      return res.status(404).json({
        error: "Order not found!",
      });
    }
    res.status(200).json(order);
  });
  disapproveServed = expressAsyncHandler(async (req, res) => {
    const {
      _id
    } = req.params;
    const {
      reason
    } = req.body;

    if (!reason) {
      return res.status(400).json({
        error: "Phải nêu rõ lý do từ chối phục vụ",
      });
    }

    const order = await OrderHelper.disapproveServed(_id, reason);
    if (!order) {
      return res.status(404).json({
        error: "Order not found!",
      });
    }
    res.status(200).json(order);
  });

  markOrderPrinted = expressAsyncHandler(async (req, res) => {
    const {
      _id
    } = req.params;
    const order = await OrderHelper.markOrderPrinted(_id);
    if (!order) {
      return res.status(404).json({
        error: "Order not found!",
      });
    }
    res.status(200).json(order);
  });
  markOrderServed = expressAsyncHandler(async (req, res) => {
    const {
      _id
    } = req.params;
    const order = await OrderHelper.markOrderServed(_id);
    if (!order) {
      return res.status(404).json({
        error: "Order not found!",
      });
    }
    res.status(200).json(order);
  });
}

export default new OrderController();
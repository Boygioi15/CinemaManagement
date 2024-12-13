import express from "express";
import TicketController from "./ticket.controller.js";

const router = express.Router();

// Routes cho ticket
router.post("/", TicketController.createTicket);
router.get("/", TicketController.getAllTickets);
router.get("/:_id", TicketController.getTicketById);
router.put("/:_id", TicketController.updateTicketById);
router.delete("/:_id", TicketController.deleteTicketById);
router.put("/:_id/cancel", TicketController.cancelTicket);
router.put("/:_id/approve", TicketController.approveTicket);
router.put("/:_id/approve-snacks", TicketController.approveSnacks);

export default router;
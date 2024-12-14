import express from "express";
import TicketController from "./ticket.controller.js";

const router = express.Router();

// Routes cho ticket
router.post("/", TicketController.createTicket);
router.get("/", TicketController.getAllTickets);
router.get("/:id", TicketController.getTicketById);
router.put("/:id", TicketController.updateTicketById);
router.delete("/:id", TicketController.deleteTicketById);
router.put("/:id/cancel", TicketController.cancelTicket);
router.put("/:id/approve", TicketController.approveTicket);
router.put("/:id/approve-snacks", TicketController.approveSnacks);

export default router;
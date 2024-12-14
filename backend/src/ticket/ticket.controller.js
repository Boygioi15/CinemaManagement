import {
    TicketService
} from "./ticket.service.js";
import expressAsyncHandler from "express-async-handler";

class TicketController {
    createTicket = expressAsyncHandler(async (req, res) => {
        const ticketData = req.body;
        try {
            const newTicket = await TicketService.createTicket(ticketData);
            res.status(201).json(newTicket);
        } catch (error) {
            res.status(500).json({
                error: error.message
            });
        }
    });

    getAllTickets = expressAsyncHandler(async (req, res) => {
        try {
            const tickets = await TicketService.getAllTickets();
            res.status(200).json(tickets);
        } catch (error) {
            res.status(500).json({
                error: error.message
            });
        }
    });

    getTicketById = expressAsyncHandler(async (req, res) => {
        const { id } = req.params;
        try {
            const ticket = await TicketService.getTicketById(id);
            if (!ticket) {
                return res.status(404).json({
                    error: "Ticket not found!"
                });
            }
            res.status(200).json(ticket);
        } catch (error) {
            res.status(500).json({
                error: error.message
            });
        }
    });

    updateTicketById = expressAsyncHandler(async (req, res) => {
        const { id } = req.params;
        const updateData = req.body;
        try {
            const updatedTicket = await TicketService.updateTicketById(id, updateData);
            if (!updatedTicket) {
                return res.status(404).json({
                    error: "Ticket not found!"
                });
            }
            res.status(200).json(updatedTicket);
        } catch (error) {
            res.status(500).json({
                error: error.message
            });
        }
    });

    deleteTicketById = expressAsyncHandler(async (req, res) => {
        const { id } = req.params;
        try {
            const result = await TicketService.deleteTicketById(id);
            if (!result) {
                return res.status(404).json({
                    error: "Ticket not found!"
                });
            }
            res.status(200).json(result);
        } catch (error) {
            res.status(500).json({
                error: error.message
            });
        }
    });

    cancelTicket = expressAsyncHandler(async (req, res) => {
        const { id } = req.params;
        const { reason } = req.body;

        if (!reason) {
            return res.status(400).json({
                error: "Cancellation reason is required!"
            });
        }

        try {
            const ticket = await TicketService.cancelTicket(id, reason);
            if (!ticket) {
                return res.status(404).json({
                    error: "Ticket not found!"
                });
            }
            res.status(200).json(ticket);
        } catch (error) {
            res.status(500).json({
                error: error.message
            });
        }
    });

    approveTicket = expressAsyncHandler(async (req, res) => {
        const { id } = req.params;

        try {
            const ticket = await TicketService.approveTicket(id);
            if (!ticket) {
                return res.status(404).json({
                    error: "Ticket not found!"
                });
            }
            res.status(200).json(ticket);
        } catch (error) {
            res.status(500).json({
                error: error.message
            });
        }
    });

    approveSnacks = expressAsyncHandler(async (req, res) => {
        const { id } = req.params;
        const { items } = req.body;

        if (!items || !Array.isArray(items)) {
            return res.status(400).json({
                error: "Items array is required for snack approval!"
            });
        }

        try {
            const ticket = await TicketService.approveSnacks(id, items);
            if (!ticket) {
                return res.status(404).json({
                    error: "Ticket not found!"
                });
            }
            res.status(200).json(ticket);
        } catch (error) {
            res.status(500).json({
                error: error.message
            });
        }
    });
}

export default new TicketController();
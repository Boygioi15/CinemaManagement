import ticketModel from "./ticket.schema.js";

export class TicketService {
    static createTicket = async (ticketData) => {
        try {
            const newTicket = new ticketModel(ticketData);
            return await newTicket.save();
        } catch (error) {
            console.error("Error creating ticket:", error);
            throw new Error("An error occurred while creating the ticket.");
        }
    };

    static updateTicketById = async (id, updateData) => {
        try {
            const updatedTicket = await ticketModel.findByIdAndUpdate(
                id,
                updateData,
                { new: true } // Return the updated document
            ).populate("items customer_id");

            return updatedTicket || { error: "Ticket not found." };
        } catch (error) {
            console.error("Error updating ticket:", error);
            throw new Error("An error occurred while updating the ticket.");
        }
    };

    static deleteTicketById = async (id) => {
        try {
            const deletedTicket = await ticketModel.findByIdAndDelete(id);
            return deletedTicket
                ? { message: "Ticket deleted successfully." }
                : { error: "Ticket not found." };
        } catch (error) {
            console.error("Error deleting ticket:", error);
            throw new Error("An error occurred while deleting the ticket.");
        }
    };

    static getAllTickets = async () => {
        try {
            return await ticketModel.find({}).populate("items customer_id");
        } catch (error) {
            console.error("Error fetching tickets:", error);
            throw new Error("An error occurred while fetching tickets.");
        }
    };

    static getTicketById = async (id) => {
        try {
            const ticket = await ticketModel.findById(id).populate("items customer_id");
            return ticket || { error: "Ticket not found." };
        } catch (error) {
            console.error("Error fetching ticket by ID:", error);
            throw new Error("An error occurred while fetching the ticket.");
        }
    };

    static cancelTicket = async (id, reason) => {
        try {
            const ticket = await ticketModel.findByIdAndUpdate(
                id,
                { served: false, invalidReason: reason },
                { new: true } // Return the updated document
            );

            return ticket || { error: "Ticket not found." };
        } catch (error) {
            console.error("Error canceling ticket:", error);
            throw new Error("An error occurred while canceling the ticket.");
        }
    };

    static approveSnacks = async (id, approvedItems) => {
        try {
            const ticket = await ticketModel.findById(id);
            if (!ticket) return { error: "Ticket not found." };

            // Update approved items
            ticket.items = ticket.items.map((item) =>
                approvedItems.some((approved) => approved.name === item.name)
                    ? { ...item, approved: true }
                    : item
            );

            ticket.served = true;
            await ticket.save();

            return ticket;
        } catch (error) {
            console.error("Error approving snacks:", error);
            throw new Error("An error occurred while approving the snacks.");
        }
    };
}

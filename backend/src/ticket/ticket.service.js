import {
    TicketTypeModel
} from "../param/param.schema.js";
import ticketModel from "./ticket.schema.js";
import {
    customError
} from "../middlewares/errorHandlers.js";
import additionalItemModel from "../additionalItem/additionalItem.schema.js";
import {
    RoomService
} from "../room/room.service.js";
import filmShowModel from "../filmShow/filmShow.schema.js";
import {
    AdditionalItemService
} from "../additionalItem/additionalItem.service.js";
import {
    ParamService
} from "../param/param.service.js";
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

    static updateTicketBy_id = async (_id, updateData) => {
        try {
            const updatedTicket = await ticketModel.findBy_idAndUpdate(
                _id,
                updateData, {
                    new: true
                }
            ).populate("items customer_id");

            return updatedTicket || null;
        } catch (error) {
            console.error("Error updating ticket:", error);
            throw new Error("An error occurred while updating the ticket.");
        }
    };

    static deleteTicketBy_id = async (_id) => {
        try {
            const deletedTicket = await ticketModel.findBy_idAndDelete(_id);
            return deletedTicket ? {
                    message: "Ticket deleted successfully."
                } :
                null;
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

    static getTicketBy_id = async (_id) => {
        try {
            const ticket = await ticketModel.findBy_id(_id).populate("items customer_id");
            return ticket || null;
        } catch (error) {
            console.error("Error fetching ticket by _id:", error);
            throw new Error("An error occurred while fetching the ticket.");
        }
    };

    static cancelTicket = async (_id, reason) => {
        try {
            const ticket = await ticketModel.findBy_idAndUpdate(
                _id, {
                    served: false,
                    inval_idReason: reason
                }, {
                    new: true
                }
            );

            return ticket || null;
        } catch (error) {
            console.error("Error canceling ticket:", error);
            throw new Error("An error occurred while canceling the ticket.");
        }
    };

    static approveSnacks = async (_id, approvedItems) => {
        try {
            const ticket = await ticketModel.findBy_id(_id);
            if (!ticket) return null;

            const updatedItems = ticket.items.map((item) =>
                approvedItems.some((approved) => approved.name === item.name) ? {
                    ...item,
                    approved: true
                } :
                item
            );

            ticket.items = updatedItems;
            ticket.served = true;
            await ticket.save();

            return ticket;
        } catch (error) {
            console.error("Error approving snacks:", error);
            throw new Error("An error occurred while approving the snacks.");
        }
    };



    // TicketInfo: {
    //     FilmName
    //     ShowDate
    //     ShowTime
    //     RoomName
    //     Seats: [{
    //         SeatID
    //     }]
    //     Tickets: [{
    //         id   // id of ticketType
    //         Quantity
    //     }]
    // }
    // AdditionalItems:[ {
    //     ref(id)
    //     Quantity
    // }]

    // Định nghĩa hàm tĩnh để lấy 7 số cuối từ ObjectId
    static getLast7DigitsOfTicketId = (ticketId) => {
        return ticketId.toString().slice(-7); // Lấy 7 số cuối
    }

    static createTicketOrder = async ({
        customerId,
        customerInfo,
        tickets,
        additionalItems,
        filmShowId,
        totalPrice,
        seats
    }) => {
        const filmShow = await filmShowModel.findById(filmShowId).populate("film");

        if (!filmShow) throw new Error("Film Show not found");

        const {
            roomName,
            seatNames
        } = await RoomService.getSeatName(filmShow.roomId, seats);

        const dataFilmShow = {
            filmName: filmShow.film.name,
            date: filmShow.showDate,
            time: filmShow.showTime,
        };

        const items = await AdditionalItemService.getAdditionalItemsInfo(additionalItems);


        const ticketDetails = await ParamService.getTicketsInfo(tickets)

        const newTicket = await ticketModel.create({
            roomName,
            seatNames,
            ...dataFilmShow,
            totalMoney: totalPrice,
            items,
            tickets: ticketDetails,
            customerID: customerId,
            customerInfo
        });

        const last7Digits = this.getLast7DigitsOfTicketId(newTicket._id);

        newTicket.verifyCode = last7Digits;

        await newTicket.save();

        return newTicket;
    };



}
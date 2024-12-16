import expressAsyncHandler from "express-async-handler";
import additionalItemModel from "../additionalItem/additionalItem.schema.js";
import filmShowModel from "../filmShow/filmShow.schema.js";
import {
    TicketTypeModel
} from "../param/param.schema.js";
import {
    customError
} from "./errorHandlers.js";

export const checkOutTicket = expressAsyncHandler(async (
    req, res, next
) => {
    /*
        customerId,
        customerInfo:{ name, phone ,enmail},
        tickets: [{id,quantity}],
        seats:[seatId],
        filmShowId,
        additonalItems: [{id,quantity}],
        totalPrice
     */
    try {
        const {
            customerId,
            customerInfo,
            tickets,
            additionalItems,
            filmShowId,
            totalPrice,
            seats
        } = req.body;



        let totalPriceByServer = 0;

        await Promise.all(tickets.map(async (ticket) => {
            const {
                id,
                quantity
            } = ticket

            const ticketTypeFound = await TicketTypeModel.findById(id).lean();
            if (!ticketTypeFound) throw customError("Ticket type not found")

            totalPriceByServer += ticketTypeFound.price * quantity;
        }))


        await Promise.all(additionalItems.map(async (additionalItem) => {
            const {
                id,
                quantity
            } = additionalItem

            const additionalItemFound = await additionalItemModel.findById(id).lean();
            if (!additionalItemFound) throw customError("Additionalitem not found")

            totalPriceByServer += additionalItemFound.price * quantity;
        }))

        console.log("🚀 ~ totalPriceByServer:", totalPriceByServer)
        if (totalPrice !== totalPriceByServer) throw customError("The total value is not accurate");

        // lock seat
        const fimlShow = await filmShowModel.findById(filmShowId);
        if (!fimlShow) throw customError("Filmshow not found ", 400)

        fimlShow.locketSeatIds.push(...seats);

        await fimlShow.save();

        // pass
        next();

    } catch (error) {
        console.log("🚀 ~ error:", error)
        next(error)

    }
});
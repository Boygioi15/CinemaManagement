import additionalItemModel from "../additionalItem/additionalItem.schema.js";
import {
    TicketTypeModel
} from "../param/param.schema.js";

export const checkOutTicket = async (
    req, res, next
) => {
    try {
        console.log("Middleware")
        req.checkoutData = {
            totalPrice: 500000
        }
        next();

        // const {
        //     customerInfo,
        //     ticketInfo,
        //     additionalItems
        // } = req.body;

        // const tickets = ticketInfo.tickets;

        // let totalPrice = 0;

        // Promise.all(tickets.map(async (ticket) => {
        //     const {
        //         id,
        //         quantity
        //     } = ticket

        //     const ticketTypeFound = await TicketTypeModel.findById(id).lean();
        //     if (!ticketTypeFound) throw customError("Ticket type not found")

        //     totalPrice += ticketTypeFound.price * quantity;
        // }))


        // Promise.all(additionalItems.map(async (additionalItem) => {
        //     const {
        //         id,
        //         quantity
        //     } = additionalItem

        //     const additionalItemFound = await additionalItemModel.findById(id).lean();
        //     if (!additionalItemFound) throw customError("Additionalitem not found")

        //     totalPrice += additionalItemFound.price * quantity;
        // }))

        // req.checkoutData = {
        //     totalPrice,
        //     customerInfo,
        //     ticketInfo,
        //     additionalItems
        // };
        // next();
    } catch (error) {
        console.log("🚀 ~ error:", error)
        next(error)
    }

}



// //---------------------------
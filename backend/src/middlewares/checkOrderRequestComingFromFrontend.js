import expressAsyncHandler from "express-async-handler";
import additionalItemModel from "../additionalItem/additionalItem.schema.js";
import filmShowModel from "../filmShow/filmShow.schema.js";
import {
  TicketTypeModel
} from "../param/param.schema.js";
import {
  customError
} from "./errorHandlers.js";
import {
  validateEmail,
  validatePhone,
} from "../ulitilities/ultilitiesFunction.js";
import {
  FilmShowService
} from "../filmShow/filmShow.service.js";
export const checkOrderRequestComingFromFrontend = expressAsyncHandler(
  async (req, res, next) => {
    const customerInfo = req.body.customerInfo;
    if (!customerInfo) {
      throw new Error("Không có thông tin người dùng!");
    }
    if (!customerInfo.name || !customerInfo.email || !customerInfo.phone) {
      throw new Error("Thông tin người dùng bị thiếu!");
    }
    const {
      tickets,
      additionalItems,
      filmShowId,
      totalPrice,
      seats
    } =
    req.body;

    let totalPriceByServer = 0;

    if (tickets) {
      const totalTickets = tickets.reduce(
        (sum, ticket) => sum + ticket.quantity,
        0
      );

      if (totalTickets !== seats?.length) {
        throw customError("Số lượng ghế khác số lượng vé?");
      }


      totalPriceByServer = 0;

      await Promise.all(
        tickets.map(async (ticket) => {
          const {
            id,
            quantity
          } = ticket;

          const ticketTypeFound = await TicketTypeModel.findById(id).lean();
          if (!ticketTypeFound) throw customError("Ticket type not found");

          totalPriceByServer += ticketTypeFound.price * quantity;
        })
      );
    }

    await Promise.all(
      additionalItems.map(async (additionalItem) => {
        const {
          id,
          quantity
        } = additionalItem;

        const additionalItemFound = await additionalItemModel
          .findById(id)
          .lean();

        if (!additionalItemFound) throw customError("Additionalitem not found");

        totalPriceByServer += additionalItemFound.price * quantity;
      })
    );

    if (totalPrice !== totalPriceByServer)
      throw customError("Tổng lượng tiền cần thanh toán không hợp lệ!");

    next();
  }
);
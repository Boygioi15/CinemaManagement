import expressAsyncHandler from "express-async-handler";
import additionalItemModel from "../additionalItem/additionalItem.schema.js";
import {
  TicketTypeModel
} from "../param/param.schema.js";
import {
  customError
} from "./errorHandlers.js";
import {
  PromotionService
} from "../promotion/promotion.service.js";

export const checkOrderRequestComingFromFrontend = expressAsyncHandler(
  async (req, res, next) => {

    const {
      ticketSelections,
      additionalItemSelections,
      filmShowId,
      totalPrice,
      seatSelections,
      promotionIDs,
    } = req.body;
    req.body.user = req.user

    let totalPriceByServer = 0;

    if (ticketSelections) {
      const totalTickets = ticketSelections.reduce(
        (sum, ticket) => sum + ticket.quantity,
        0
      );
      let noOfSeatSelected = 0;
      for (let i = 0; i < seatSelections.length; i++) {
        for (let j = 0; j < seatSelections[0].length; j++) {
          if (seatSelections[i][j].selected) {
            noOfSeatSelected++;
          }
        }
      }
      if (totalTickets !== noOfSeatSelected) {
        throw customError("Số lượng ghế khác số lượng vé", 400);
      }

      totalPriceByServer = 0;
      await Promise.all(
        ticketSelections.map(async (ticket) => {
          const {
            _id,
            quantity
          } = ticket;

          const ticketTypeFound = await TicketTypeModel.findById(_id).lean();
          if (!ticketTypeFound) throw customError("Ticket type not found");

          totalPriceByServer += ticketTypeFound.price * quantity;
        })
      );
    }

    if (additionalItemSelections && additionalItemSelections.length > 0)
      await Promise.all(
        additionalItemSelections &&
        additionalItemSelections.map(async (additionalItem) => {
          const {
            _id,
            quantity
          } = additionalItem;

          const additionalItemFound = await additionalItemModel
            .findById(_id)
            .lean();

          if (!additionalItemFound)
            throw customError("Additionalitem not found");

          totalPriceByServer += additionalItemFound.price * quantity;
        })
      );

    if (seatSelections) {
      let vCount = 0;
      for (let i = 0; i < seatSelections.length; i++) {
        for (let j = 0; j < seatSelections[i].length; j++) {
          if (seatSelections[i][j].selected) {
            if (seatSelections[i][j].seatType === "V") {
              vCount++;
            }
          }
        }
      }
      totalPriceByServer += vCount * 20000;

    }


    if (totalPrice !== totalPriceByServer)
      throw customError("Tổng lượng tiền cần thanh toán không hợp lệ!");

    const discountAmount = await PromotionService.getPromotionDiscountAmount(totalPrice, promotionIDs);
    req.body.totalPriceAfterDiscount = totalPrice - discountAmount;


    next();
  }
);
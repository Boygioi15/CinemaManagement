import orderModel from "./order.schema.js";
import { RoomService } from "../room/room.service.js";
import filmShowModel from "../filmShow/filmShow.schema.js";
import { AdditionalItemService } from "../additionalItem/additionalItem.service.js";
import { ParamService } from "../param/param.service.js";
import { generateRandomVerifyCode } from "../ulitilities/ultilitiesFunction.js";
import { customError } from "../middlewares/errorHandlers.js";
import { FilmService } from "../film/film.service.js";
import filmModel from "../film/film.schema.js";
import roomModel from "../room/room.schema.js";
import { TicketTypeModel } from "../param/param.schema.js";
import additionalItemModel from "../additionalItem/additionalItem.schema.js";
import promotionModel from "../promotion/promotion.schema.js";
export class OrderService {
  static getAllOrders = async () => {
    return await orderModel.find().sort({ createdAt: -1 });
  };
  static getOrderBy_id = async (_id) => {
    try {
      const ticket = await orderModel
        .findById(_id)
        .populate("items customer_id");
      return ticket || null;
    } catch (error) {
      console.error("Error fetching ticket by _id:", error);
      throw new Error("An error occurred while fetching the order.");
    }
  };

  static disapprovePrinted = async (_id, reason) => {
    try {
      const order = await orderModel.findByIdAndUpdate(
        _id,
        {
          served: false,
          invalidReason_Printed: reason,
        },
        {
          new: true,
        }
      );

      return order || null;
    } catch (error) {
      console.error("Error canceling ticket:", error);
      throw new Error("An error occurred while canceling the ticket.");
    }
  };

  static disapproveServed = async (_id, reason) => {
    try {
      const order = await orderModel.findByIdAndUpdate(
        _id,
        {
          served: false,
          invalidReason_Served: reason,
        },
        {
          new: true,
        }
      );

      return order || null;
    } catch (error) {
      console.error("Error canceling ticket:", error);
      throw new Error("An error occurred while canceling the ticket.");
    }
  };

  static markOrderPrinted = async (_id) => {
    const order = await orderModel.findById(_id);
    if (!order) return null;
    if (order.printed) {
      throw customError("Vé đã được in");
    }

    return await orderModel.findByIdAndUpdate(
      _id,
      {
        printed: true,
      },
      {
        new: true,
      }
    );
  };

  static markOrderServed = async (_id) => {
    const order = await orderModel.findById(_id);
    if (!order) return null;
    if (order.served) {
      throw customError("Vé đã được phục vụ");
    }

    return await orderModel.findByIdAndUpdate(
      _id,
      {
        served: true,
      },
      {
        new: true,
      }
    );
  };

  static createOrder = async ({
    customerId,
    customerInfo,
    tickets = null,
    additionalItems = null,
    filmShowId = null,
    totalPrice,
    seats = null,
    promotionId = null,
  }) => {
    console.log(additionalItems);
    let filmShow = {};
    let film = {};
    let roomName = null;
    if (filmShowId) {
      filmShow = await filmShowModel.findById(filmShowId).populate("film");
      if (!filmShow) throw new Error("Film Show not found");
      roomName = (await roomModel.findById(filmShow.roomId)).roomName;
      film = await filmModel.findById(filmShow.film);
    }

    const ageRestriction = film?.ageRestriction || null;
    const dataFilmShow = {
      filmName: filmShow?.film?.name || null,
      date: filmShow?.showDate || null,
      time: filmShow?.showTime || null,
    };

    const seatNames = seats.map((seat) => seat.seatName);
    const nItems = await Promise.all(
      additionalItems.map(async (items) => {
        const item = await additionalItemModel.findById(items._id);
        return {
          name: item.name,
          unitPrice: item.price,
          quantity: items.quantity,
        };
      })
    );

    const nTickets = await Promise.all(
      tickets.map(async (ticket) => {
        const ticketData = await TicketTypeModel.findById(ticket._id);
        return {
          name: ticketData.title,
          unitPrice: ticketData.price,
          quantity: ticket.quantity,
        };
      })
    );

    console.log(nItems, nTickets);

    let discountRate = 0;
    if (promotionId) {
      const promotion = await promotionModel.findById(promotionId);
      if (promotion) {
        discountRate = promotion.discountRate || 0;
      }
    }

    const totalMoneyAfterDiscount =
      totalPrice - (totalPrice * discountRate) / 100;

    const newOrder = await orderModel.create({
      roomName,
      seatNames,
      ageRestriction,
      ...dataFilmShow,
      totalMoney: totalPrice,
      totalMoneyAfterDiscount: totalMoneyAfterDiscount,
      items: nItems,
      tickets: nTickets,
      customerID: customerId,
      promotionID: promotionId,
      customerInfo,
    });

    newOrder.verifyCode = generateRandomVerifyCode();
    console.log(newOrder);
    return await newOrder.save();
  };
}

import orderModel from "./order.schema.js";
import { RoomService } from "../room/room.service.js";
import filmShowModel from "../filmShow/filmShow.schema.js";
import { AdditionalItemService } from "../additionalItem/additionalItem.service.js";
import { ParamService } from "../param/param.service.js";
import { generateRandomVerifyCode } from "../ulitilities/ultilitiesFunction.js";
import { customError } from "../middlewares/errorHandlers.js";
import { FilmService } from "../film/film.service.js";
export class OrderService {
  static getAllOrders = async () => {
    return await orderModel.find();
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

  static disapproveOrder = async (_id, reason) => {
    try {
      const order = await orderModel.findByIdAndUpdate(
        _id,
        {
          served: false,
          invalid_Reason: reason,
        },
        {
          new: true,
        }
      );

      return ticket || null;
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
      { new: true }
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
      { new: true }
    );
  };
  static createOrder = async ({
    customerId,
    customerInfo,
    tickets,
    additionalItems,
    filmShowId,
    totalPrice,
    seats,
  }) => {
    const filmShow = await filmShowModel.findById(filmShowId).populate("film");

    if (!filmShow) throw new Error("Film Show not found");
    const film = await FilmService.findById(filmShow.film);
    const ageRestriction = film.ageRestriction;
    const { roomName, seatNames } = await RoomService.getSeatName(
      filmShow.roomId,
      seats
    );

    const dataFilmShow = {
      filmName: filmShow.film.name,
      date: filmShow.showDate,
      time: filmShow.showTime,
    };

    const items = await AdditionalItemService.getAdditionalItemsInfo(
      additionalItems
    );

    const ticketDetails = await ParamService.getTicketsInfo(tickets);

    const newOrder = await orderModel.create({
      roomName,
      seatNames,
      ageRestriction,
      ...dataFilmShow,
      totalMoney: totalPrice,
      items,
      tickets: ticketDetails,
      customerID: customerId,
      customerInfo,
    });

    newOrder.verifyCode = generateRandomVerifyCode();

    return await newOrder.save();
  };
}

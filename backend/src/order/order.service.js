import orderModel from "./order.schema.js";
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
import {
  generateRandomVerifyCode
} from "../ulitilities/ultilitiesFunction.js";
import {
  customError
} from "../middlewares/errorHandlers.js";
import {
  FilmService
} from "../film/film.service.js";
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

  static disapprovePrinted = async (_id, reason) => {
    try {
      const order = await orderModel.findByIdAndUpdate(
        _id, {
          served: false,
          invalidReason_Printed: reason,
        }, {
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
        _id, {
          served: false,
          invalidReason_Served: reason,
        }, {
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
      _id, {
        printed: true,
      }, {
        new: true
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
      _id, {
        served: true,
      }, {
        new: true
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
  }) => {

    let filmShow = {}
    let film = {}
    if (filmShowId) {
      filmShow = await filmShowModel.findById(filmShowId).populate("film");

      if (!filmShow) throw new Error("Film Show not found");

      film = await FilmService.findById(filmShow.film);

    }

    const ageRestriction = film?.ageRestriction || null;
    const dataFilmShow = {
      filmName: filmShow?.film?.name || null,
      date: filmShow?.showDate || null,
      time: filmShow?.showTime || null,
    };

    const {
      roomName,
      seatNames
    } = seats ? await RoomService.getSeatName(filmShow.roomId, seats) : {
      roomName: null,
      seatNames: []
    };


    let items = [];
    if (additionalItems) {
      items = await AdditionalItemService.getAdditionalItemsInfo(additionalItems);
    }

    let ticketDetails = [];
    if (tickets) {
      ticketDetails = await ParamService.getTicketsInfo(tickets);
    }

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
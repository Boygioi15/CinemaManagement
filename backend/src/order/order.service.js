import orderModel from "./order.schema.js";
import { RoomService } from "../room/room.service.js";
import filmShowModel from "../filmShow/filmShow.schema.js";
import { AdditionalItemService } from "../additionalItem/additionalItem.service.js";
import { ParamService } from "../param/param.service.js";
import { generateRandomVerifyCode } from "../ulitilities/ultilitiesFunction.js";
export class OrderService {
  static getAllOrders = async () => {
    try {
      return await orderModel.find({}).populate("items customer_id");
    } catch (error) {
      console.error("Error fetching tickets:", error);
      throw new Error("An error occurred while fetching tickets.");
    }
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

  static markOrderServed = async (_id, approvedItems) => {
    try {
      const ticket = await orderModel.findById(_id);
      if (!ticket) return null;

      const updatedItems = ticket.items.map((item) =>
        approvedItems.some((approved) => approved.name === item.name)
          ? {
              ...item,
              approved: true,
            }
          : item
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

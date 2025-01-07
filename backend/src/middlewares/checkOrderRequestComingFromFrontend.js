import expressAsyncHandler from "express-async-handler";
import additionalItemModel from "../additionalItem/additionalItem.schema.js";
import filmShowModel from "../filmShow/filmShow.schema.js";
import { TicketTypeModel } from "../param/param.schema.js";
import { customError } from "./errorHandlers.js";
import {
  validateEmail,
  validatePhone,
} from "../ulitilities/ultilitiesFunction.js";
import { FilmShowService } from "../filmShow/filmShow.service.js";
import filmModel from "../film/film.schema.js";
import roomModel from "../room/room.schema.js";

export const checkOrderRequestComingFromFrontend = expressAsyncHandler(
  async (req, res, next) => {
    const {
      customerInfo,
      user,
      totalPrice,
      filmShowId,
      seatSelections,
      ticketSelections,
      additionalItemSelections,
    } = req.body;

    if (!customerInfo) {
      throw new Error("Không có thông tin người dùng!");
    }
    if (!customerInfo.name || !customerInfo.email || !customerInfo.phone) {
      throw new Error("Thông tin người dùng bị thiếu!");
    }

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
        throw customError("Số ghế đã đặt phải bằng số lượng vé đã chọn", 400);
      }
      //data seeding
      const filmShowData = {};
      const filmShow = await filmShowModel.findById(filmShowId);
      const film = await filmModel.findById(filmShow.film);
      filmShowData.filmName = film.filmName;
      filmShowData.ageRestriction = film.ageRestriction;
      filmShowData.showDate = filmShow.showDate;
      filmShowData.showTime = filmShow.showTime;
      const room = await roomModel.findById(filmShow.roomId);
      filmShowData.roomName = room.roomName;
      //tickets
      const tickets = [];
      await Promise.all(
        tickets.map(async (ticket) => {
          const { _id, quantity } = ticket;
          if (quantity <= 0 || quantity >= 8) {
            throw customError(
              "Số lượng từng loại vé phải lớn hơn 0, bé hơn 9",
              400
            );
          }
          const ticketTypeFound = await TicketTypeModel.findById(_id).lean();
          if (!ticketTypeFound) {
            throw customError("Dữ liệu loại vé không hợp lệ", 400);
          }
          tickets.push({
            name: ticketTypeFound.title,
            price: ticketTypeFound.price,
            quantity: quantity,
          });
          totalPriceByServer += ticketTypeFound.price * quantity;
        })
      );
      filmShowData.tickets = tickets;

      //pre-process seat
      const seats = [];
      for (let i = 0; i < seatSelections.length; i++) {
        for (let j = 0; j < seatSelections[0].length; j++) {
          if (seatSelections[i][j].selected) {
            const newSeat = seatSelections[i][j];
            newSeat.i = i;
            newSeat.j = j;
            seats.push(newSeat);
          }
        }
      }
      //check seats validity && lock seats
      await FilmShowService.appendLockedSeats(filmShowId, seats);
      req.body.currentLockedSeats = seats;
      console.log(filmShowData);

      ///continue calculating price for VIP seat
      if (seats) {
        let vCount = 0;
        for (let i = 0; i < seats.length; i++) {
          for (let j = 0; j < seats[i].length; j++) {
            if (seats[i][j].selected) {
              if (seats[i][j].seatType === "V") {
                vCount++;
              }
            }
          }
        }
        totalPriceByServer += vCount * 20000;
      }

      req.body.filmShowData = filmShowData;
    }
    if (additionalItemSelections) {
      const itemsData = [];
      await Promise.all(
        additionalItemSelections.map(async (additionalItem) => {
          const { _id, quantity } = additionalItem;

          const additionalItemFound = await additionalItemModel
            .findById(_id)
            .lean();

          if (!additionalItemFound)
            throw customError("Additionalitem not found");
          itemsData.push({
            name: additionalItem.name,
            quantity: additionalItem.quantity,
            price: additionalItem.price,
          });
          totalPriceByServer += additionalItemFound.price * quantity;
        })
      );
      req.body.itemsData = itemsData;
    }
    console.log(req.body);
    if (totalPrice !== totalPriceByServer)
      throw customError("Tổng lượng tiền cần thanh toán không hợp lệ!");
    next();
  }
);

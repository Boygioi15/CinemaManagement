import mongoose from "mongoose";
import { FilmService } from "../film/film.service.js";
import { customError } from "../middlewares/errorHandlers.js";
import roomModel from "../room/room.schema.js";
import filmShowModel from "./filmShow.schema.js";
import expressAsyncHandler from "express-async-handler";
import { RoomService } from "../room/room.service.js";

export class FilmShowService {
  //Cho phép tạo suất chiếu cùng 1 phim nếu khác phòng
  static createFilmShow = async ({ roomId, showTime, showDate, film }) => {
    const showStart = new Date(`${showDate}T${showTime}`);
    const filmDetails = await FilmService.getFilmDetails(film);
    if (!filmDetails) {
      throw customError("Phim không tồn tại", 404);
    }
    const filmDuration = filmDetails.filmDuration;
    const showEnd = new Date(showStart.getTime() + filmDuration * 60000);
    // Tìm các suất chiếu có khả năng trùng lặp
    const overlappingShows = await filmShowModel.find({
      roomId,
      showDate,
      $or: [
        { showTime: { $gte: new Date(showStart.getTime() - 30 * 60000).toISOString() } },
        { showTime: { $lte: new Date(showEnd.getTime() + 30 * 60000).toISOString() } },
      ],
    });
    // Kiểm tra trùng lặp thời gian
    const isOverlapping = await Promise.all(
      overlappingShows.map(async (existingShow) => {
        const existingShowStart = new Date(`${existingShow.showDate}T${existingShow.showTime}`);
        const existingFilmDetails = await FilmService.getFilmDetails(existingShow.film);
        const existingFilmDuration = existingFilmDetails.filmDuration;
        const existingShowEnd = new Date(existingShowStart.getTime() + existingFilmDuration * 60000);
  
        const isStartInsideExisting =
          showStart >= existingShowStart && showStart < existingShowEnd;
        const isEndInsideExisting =
          showEnd > existingShowStart && showEnd <= existingShowEnd;
        const isGapTooSmall =
          Math.abs(showStart - existingShowEnd) < 30 * 60000 ||
          Math.abs(showEnd - existingShowStart) < 30 * 60000;
  
        return isStartInsideExisting || isEndInsideExisting || isGapTooSmall;
      })
    );
    if (isOverlapping.some((overlap) => overlap)) {
      throw customError(
        "Khoảng thời gian không khả dụng. Vui lòng chọn thời điểm khác.",
        400
      );
    }
    // Tạo suất chiếu
    return await filmShowModel.create({
      roomId,
      showTime,
      showDate,
      film,
    });
  };
  
  static getListFilmShowing = async () => {
    const filmShows = await filmShowModel
      .find({
        showDate: {
          $gte: new Date(),
        },
      })
      .populate({
        path: "film",
      })
      .lean();

    const uniqueFilms = [];

    filmShows.forEach((filmShow) => {
      if (
        !uniqueFilms.some(
          (film) => film._id.toString() === filmShow.film._id.toString()
        )
      ) {
        uniqueFilms.push(filmShow.film);
      }
    });

    return uniqueFilms;
  };

  static getUpComingFilm = async () => {
    return await FilmService.getUpComingFilm();
  };

  static getShowtimesByDate = async (filmId, date) => {
    const selectedDate = new Date(date);

    const res = await filmShowModel.aggregate([
      {
        $match: {
          film: new mongoose.Types.ObjectId(filmId),
          showDate: date,
        },
      },
      {
        $group: {
          _id: "$filmType",
          showTimes: {
            $push: {
              _id: "$_id",
              showTime: "$showTime",
            },
          },
        },
      },
      {
        $project: {
          showType: "$_id",
          _id: 0,
          showTimes: 1,
        },
      },
    ]);

    return res;
  };

  static getAllFilmShowByFilmId = async (filmId) => {
    const filmShows = await filmShowModel
      .find({
        film: filmId,
        showDate: {
          $gte: new Date(),
        },
      })
      .select("showDate")
      .lean();

    const arrayShowDates = filmShows.map((item) => item.showDate);
    const uniqueShowDates = [
      ...new Set(arrayShowDates.map((date) => date.toISOString())),
    ].map((dateStr) => new Date(dateStr));

    const res = await Promise.all(
      uniqueShowDates.map(async (date) => {
        const showtimes = await this.getShowtimesByDate(filmId, date);
        if (showtimes.length === 0) {
          return null;
        }
        return {
          date,
          show: showtimes,
        };
      })
    );
    return (await res).filter((item) => item !== null);
  };
  static getFilmShow = expressAsyncHandler(async (filmShowId) => {
    return await filmShowModel.findById(filmShowId);
  });
  static getHostRoomOfFilmShow = expressAsyncHandler(async (filmShowId) => {
    const filmShow = await filmShowModel.findById(filmShowId);
    if (!filmShow) throw customError("Film show not found", 400);

    const roomOfFilmShow = await roomModel
      .findById(filmShow.roomId)
      .populate({
        path: "seats",
        select: "seatName seatCol seatRow usable",
      })
      .lean(); // Chuyển kết quả về object JS thuần

    roomOfFilmShow.seats = roomOfFilmShow.seats.map((seat) => ({
      ...seat,
      isLocked: filmShow.lockedSeatIds.includes(seat._id),
    }));

    return roomOfFilmShow;
  });
  static checkIfSeatAreInRoom = async (roomID, seatIds) => {
    const room = await roomModel.findById(roomID);
    if (!room) {
      throw new Error("Không tồn tại phòng");
    }

    // Extract seat IDs from the room
    const roomSeatIds = room.seats.map((seat) => seat._id.toString());

    // Check if all seatIds are present in room.seats
    const allSeatsPresent = seatIds.every((seatId) =>
      roomSeatIds.includes(seatId.toString())
    );
    if (!allSeatsPresent) {
      throw customError("Ghế không nằm ở trong phòng", 400);
    }
  };
  static appendLockedSeats = expressAsyncHandler(
    async (filmShowID, seatIDs) => {
      const filmShow = await filmShowModel.findById(filmShowID);
      await this.checkIfSeatAreInRoom(filmShow.roomId, seatIDs);

      // Ensure none of the seatIDs are in filmShow.lockedSeats
      const lockedSeatIds = filmShow.lockedSeatIds.map((seat) =>
        seat.toString()
      );
      const hasLockedSeats = await seatIDs.some((seatID) =>
        lockedSeatIds.includes(seatID.toString())
      );
      if (hasLockedSeats) {
        throw customError("Ghế đã bị khóa từ trước", 404);
      }

      if (!filmShow) throw customError("Không tìm thấy suất phim", 400);

      //get the host room
      //check if
      filmShow.lockedSeatIds.push(...seatIDs);

      await filmShow.save();
    }
  );
  static releaseLockedSeats = expressAsyncHandler(
    async (filmShowID, seatIDs) => {
      const filmShow = await filmShowModel.findById(filmShowID);
      await this.checkIfSeatAreInRoom(filmShow.roomId, seatIDs);
      if (!filmShow) throw customError("Filmshow not found ", 400);

      filmShow.lockedSeatIds = filmShow.lockedSeatIds.filter(
        (seatId) => !filmShow.lockedSeatIds.includes(seatId)
      );
      await filmShow.save();
    }
  );
  static refreshLockedSeat = expressAsyncHandler(async (id) => {
    const filmShow = await filmShowModel.findByIdAndUpdate(
      id,
      {
        lockedSeatIds: [],
      },
      {
        new: true,
      }
    );
    return filmShow;
  });
}

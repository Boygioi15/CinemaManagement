import expressAsyncHandler from "express-async-handler";
import { SeatService } from "./seat.service.js";
import { RoomService } from "../room/room.service.js";

class SeatController {
    addSeat = expressAsyncHandler(async (req, res) => {
        const { roomId, seatRow, seatCol } = req.body;
        const newSeat = await RoomService.addSeatToRoom(roomId, seatRow, seatCol);
        res.status(201).json({
            success: true,
            message: "Seat added successfully!",
            data: newSeat,
        });

    });

    updateSeat = expressAsyncHandler(async (req, res, next) => {
        const { seatId } = req.params;
        const response = await SeatService.updateSeat(seatId, req.body);
        return res.status(200).json({
            msg: "Update seat successfully!",
            success: true,
            data: response,
        });
    });


    deleteSeat = expressAsyncHandler(async (req, res, next) => {
        const { seatId } = req.params;
        const response = await SeatService.deleteSeat(seatId);
        return res.status(200).json({
            msg: "Delete seat successfully!",
            success: true,
            data: response,
        });
    });

    getAllSeats = expressAsyncHandler(async (req, res, next) => {
        const response = await SeatService.getAllSeats();
        return res.status(200).json({
            msg: "Get all seats successfully!",
            success: true,
            data: response,
        });
    });

    getSeatById = expressAsyncHandler(async (req, res, next) => {
        const { seatId } = req.params;
        const response = await SeatService.getSeatById(seatId);
        return res.status(200).json({
            msg: "Get seat by ID successfully!",
            success: true,
            data: response,
        });
    });
}
export default new SeatController()
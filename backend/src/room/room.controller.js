import expressAsyncHandler from "express-async-handler";
import { RoomService } from "./room.service.js";
import roomModel from "./room.schema.js";

class RoomController {
  createRoom = expressAsyncHandler(async (req, res, next) => {
    const response = await RoomService.createRoom(req.body);
    return res.status(200).json({
      msg: "Create room successfully!",
      success: true,
      data: response,
    });
  });
  getAllRooms = expressAsyncHandler(async (req, res, next) => {
    const response = await roomModel.find();
    return res.status(200).json({
      msg: "Create room successfully!",
      success: true,
      data: response,
    });
  });
  getRoomDetail = expressAsyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const response = await roomModel.findById(id);
    return res.status(200).json({
      msg: "Create room successfully!",
      success: true,
      data: response,
    });
  });
  deleteAllRooms = expressAsyncHandler(async (req, res, next) => {
    const response = await roomModel.deleteMany();
    return res.status(200).json({
      msg: "Create room successfully!",
      success: true,
      data: response,
    });
  });
  getRoomById = expressAsyncHandler(async (req, res, next) => {
    const { roomId } = req.params;
    const room = await RoomService.getRoomById(roomId);
    return res.status(200).json({
      success: true,
      data: room,
    });
  });

  updateRoom = expressAsyncHandler(async (req, res, next) => {
    const { roomId } = req.params;
    const updatedRoom = await RoomService.updateRoom(roomId, req.body);
    return res.status(200).json({
      success: true,
      message: "Room updated successfully!",
      data: updatedRoom,
    });
  });

  deleteRoom = expressAsyncHandler(async (req, res, next) => {
    const { roomId } = req.params;
    const result = await RoomService.deleteRoom(roomId);
    return res.status(200).json({
      success: true,
      message: result.message,
    });
  });
}

export default new RoomController();

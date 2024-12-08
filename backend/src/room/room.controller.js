import expressAsyncHandler from "express-async-handler";
import {
    RoomService
} from "./room.service.js";

class RoomController {
    createRoom = expressAsyncHandler(async (req, res, next) => {
        const response = await RoomService.createRoom(req.body)
        return res.status(200).json({
            msg: "Create room successfully!",
            success: true,
            data: response
        });
    });
}

export default new RoomController()
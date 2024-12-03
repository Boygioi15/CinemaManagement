import expressAsyncHandler from "express-async-handler";
import {
    SeatService
} from "./seat.service.js";

class SeatController {
    createSeat = expressAsyncHandler(async (req, res, next) => {
        const response = await SeatService.createSeat(req.body)
        return res.status(200).json({
            msg: "Create seat successfully!",
            success: true,
            data: response
        });
    });
}

export default new SeatController()
import seatModel from "./seat.schema.js"

export class SeatService {
    static updateSeat = async (seatId, updateData) => {
        const seat = await seatModel.findOneAndUpdate(
            { _id: seatId, deleted: false },
            updateData,
            { new: true }
        );
        if (!seat) {
            throw new Error("Seat not found or has been deleted");
        }
        return seat;
    };

    static deleteSeat = async (seatId) => {
        const seat = await seatModel.findOneAndUpdate(
            { _id: seatId, deleted: false },
            { deleted: true },
            { new: true }
        );
        if (!seat) {
            throw new Error("Seat not found or has already been deleted");
        }
        return seat;
    };

    static getAllSeats = async () => {
        return await seatModel.find({ deleted: false }).sort({ createdAt: -1 });
    };

    static getSeatById = async (seatId) => {
        const seat = await seatModel.findOne({ _id: seatId, deleted: false });
        if (!seat) {
            throw new Error("Seat not found or has been deleted");
        }
        return seat;
    };
}
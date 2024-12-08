import seatModel from "./seat.schema.js"

export class SeatService {
    static createSeat = async ({
        seatName,
        isPairSeat,
        seatCol,
        seatRow,
        usable,
        other,
    }) => {
        return await seatModel.create({
            seatName,
            isPairSeat,
            seatCol,
            seatRow,
            usable,
            other,
        })
    }
}
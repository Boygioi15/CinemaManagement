import roomModel from "./room.schema.js"

export class RoomService {
    static createRoom = async ({
        roomName,
        noOfSeatRow,
        noOfSeatInEachRow,
        seats, // array
        other
    }) => {
        return await roomModel.create({
            roomName,
            noOfSeatRow,
            noOfSeatInEachRow,
            seats, // array
            other
        })
    }
}
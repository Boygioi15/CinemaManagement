import roomModel from "./room.schema.js";

export class RoomService {
  static createRoom = async ({
    roomName,
    noOfSeatRow,
    noOfSeatInEachRow,
    seats,
    centerX1,
    centerX2,
    centerY1,
    centerY2,
    roomNote,
  }) => {
    if (
      centerX2 < centerX1 ||
      centerY2 < centerY1 ||
      centerX2 > noOfSeatRow - 1 ||
      centerY2 > noOfSeatInEachRow - 1
    ) {
      throw customError("Dữ liệu khu vực trung tâm không hợp lệ!");
    }
    // Creating roomSeat-be
    const roomSeatBe = [];
    for (let i = 0; i < seats.length; i++) {
      const row = [];
      let seatNum = 0;
      for (let j = 0; j < seats[i].length; j++) {
        if (seats[i][j] !== "") {
          seatNum++;
        }
        row.push({
          seatName: String.fromCharCode(65 + i) + seatNum, // Convert row index to letter (A, B, C...)
          seatType: seats[i][j] || "", // Copy the type from the input 2D matrix
        });
      }
      roomSeatBe.push(row); // Add the row to the 2D array
    }

    //console.log("Transformed seats:", roomSeatBe);
    //console.log("roomSeatBe:", JSON.stringify(roomSeatBe, null, 2));

    const newRoom = new roomModel({
      roomName,
      noOfSeatRow,
      noOfSeatInEachRow,
      seats: roomSeatBe, // Include the dynamically generated seats
      centerX1,
      centerX2,
      centerY1,
      centerY2,
      roomNote,
    });

    // Save the room document to the database
    return await newRoom.save();
  };

  static getSeatName = async (roomId, seatIds) => {
    try {
      // Tìm phòng theo roomId
      const room = await roomModel.findById(roomId);
      if (!room) {
        throw new Error("Room not found");
      }

      const seatNames = room.seats
        .filter((seat) => seatIds.includes(seat._id.toString()))
        .map((seat) => seat.seatName);

      if (seatNames.length === 0) {
        throw new Error("No seats found");
      }

      // Trả về mảng seatName
      return {
        seatNames,
        roomName: room.roomName,
      };
    } catch (error) {
      throw new Error(error.message);
    }
  };
}

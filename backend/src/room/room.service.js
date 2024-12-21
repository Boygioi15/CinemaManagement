import roomModel from "./room.schema.js";

export class RoomService {
  // Hàm tạo phòng và tạo ghế liên kết
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
    await newRoom.save();
    return newRoom;
  };

  // Hàm lấy danh sách tên ghế dựa trên roomId và danh sách seatIds
  static getSeatName = async (roomId, seatIds) => {
    const room = await roomModel.findById(roomId).populate("seats");
    if (!room) {
      throw new Error("Room not found");
    }
    const seatNames = room.seats
      .filter((seat) => seatIds.includes(seat._id.toString()))
      .map((seat) => seat.seatName);

    if (seatNames.length === 0) {
      throw new Error("No matching seats found");
    }
    return {
      seatNames,
      roomName: room.roomName,
    };
  };

  // Hàm lấy tất cả phòng
  static getAllRooms = async () => {
    return await roomModel.find({ deleted: false }).populate("seats");
  };

  // Hàm lấy phòng theo ID
  static getRoomById = async (roomId) => {
    const room = await roomModel.findById(roomId).populate("seats");
    if (!room || room.deleted) {
      throw new Error("Room not found or has been deleted");
    }
    return room;
  };

  // Hàm cập nhật phòng
  static updateRoom = async (roomId, updatedData) => {
    const room = await roomModel.findByIdAndUpdate(roomId, updatedData, {
      new: true,
    });
    if (!room) {
      throw new Error("Room not found");
    }
    return room;
  };

  // Hàm xóa mềm phòng
  static deleteRoom = async (roomId) => {
    // Tìm phòng theo ID
    const room = await roomModel.findById(roomId);
    if (!room) {
      throw new Error("Room not found.");
    }
    if (room.deleted) {
      throw new Error("Room has already been deleted.");
    }
    // Đặt trạng thái phòng thành deleted
    room.deleted = true;
    await room.save();
    // Xóa cứng tất cả ghế trong phòng
    await seatModel.deleteMany({ roomId });
    return { message: "Room deleted successfully." };
  };

  // Kiểm tra nếu hàng và cột của ghế hợp lệ
  static validateSeatPosition = (
    seatRow,
    seatCol,
    noOfSeatRow,
    noOfSeatInEachRow
  ) => {
    if (seatRow < 1 || seatRow > noOfSeatRow) {
      throw new Error(
        `Seat row (${seatRow}) is out of range (1-${noOfSeatRow}).`
      );
    }
    if (seatCol < 1 || seatCol > noOfSeatInEachRow) {
      throw new Error(
        `Seat column (${seatCol}) is out of range (1-${noOfSeatInEachRow}).`
      );
    }
  };

  // Hàm thêm ghế cho phòng
  static addSeatToRoom = async (roomId, seatRow, seatCol) => {
    const room = await roomModel.findById(roomId);
    if (!room || room.deleted) {
      throw new Error("Room not found or has been deleted.");
    }
    // Kiểm tra nếu vị trí ghế hợp lệ
    RoomService.validateSeatPosition(
      seatRow,
      seatCol,
      room.noOfSeatRow,
      room.noOfSeatInEachRow
    );
    // Kiểm tra nếu ghế đã tồn tại trong phòng
    const existingSeat = await seatModel.findOne({ roomId, seatRow, seatCol });
    if (existingSeat) {
      throw new Error(
        `Seat at row ${seatRow}, column ${seatCol} already exists.`
      );
    }
    // Tạo ghế mới
    const seatName = `S-${seatRow}-${seatCol}`;
    const newSeat = await seatModel.create({
      seatName,
      seatRow,
      seatCol,
      usable: true,
      deleted: false,
      roomId,
    });
    // Cập nhật danh sách ghế của phòng
    room.seats.push(newSeat._id);
    await room.save();
    return newSeat;
  };
}

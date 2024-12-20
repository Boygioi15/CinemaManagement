import seatModel from "../seat/seat.schema.js";
import roomModel from "./room.schema.js";

export class RoomService {
  // Hàm tạo ghế cho phòng
  static generateSeats = async (roomId, noOfSeatRow, noOfSeatInEachRow) => {
    const seats = [];
    for (let i = 1; i <= noOfSeatRow; i++) {
      for (let j = 1; j <= noOfSeatInEachRow; j++) {
        if (Math.random() <= 0.8) {
          seats.push({
            seatName: `S-${i}-${j}`,
            seatRow: i,
            seatCol: j,
            usable: true,
            deleted: false,
            roomId,
          });
        }
      }
    }
    return seats; // Return the generated seats array
  }

  // Hàm tạo phòng và tạo ghế liên kết
  static createRoom = async ({
    roomName,
    noOfSeatRow,
    noOfSeatInEachRow,
    centerX1,
    centerX2,
    centerY1,
    centerY2,
  }) => {
    try {
      // Tìm phòng có cùng tên
      const existingRoom = await roomModel.findOne({ roomName });
      if (existingRoom) {
        if (!existingRoom.deleted) {
          // Nếu phòng chưa bị xóa
          throw new Error("A room with this name already exists.");
        } else {
          // Nếu phòng đã bị xóa mềm, cập nhật lại trạng thái và các thông tin mới
          existingRoom.deleted = false;
          existingRoom.noOfSeatRow = noOfSeatRow;
          existingRoom.noOfSeatInEachRow = noOfSeatInEachRow;
          existingRoom.centerX1 = centerX1;
          existingRoom.centerX2 = centerX2;
          existingRoom.centerY1 = centerY1;
          existingRoom.centerY2 = centerY2;
          existingRoom.seats = []; // Reset danh sách ghế cũ
          await existingRoom.save();

          // Tạo lại ghế cho phòng và lưu vào seats collection
          const seats = await RoomService.generateSeats(existingRoom._id, noOfSeatRow, noOfSeatInEachRow);
          const insertedSeats = await seatModel.insertMany(seats);

          // Cập nhật danh sách seats[] trong phòng
          existingRoom.seats = insertedSeats.map((seat) => seat._id);
          await existingRoom.save();

          return existingRoom;
        }
      }

      // Nếu không có phòng nào trùng tên, tạo phòng mới
      const newRoom = new roomModel({
        roomName,
        noOfSeatRow,
        noOfSeatInEachRow,
        centerX1,
        centerX2,
        centerY1,
        centerY2,
        seats: [],
      });
      await newRoom.save();

      // Tạo ghế cho phòng và lưu vào seats collection
      const seats = await RoomService.generateSeats(newRoom._id, noOfSeatRow, noOfSeatInEachRow);
      const insertedSeats = await seatModel.insertMany(seats);

      // Cập nhật danh sách seats[] trong phòng
      newRoom.seats = insertedSeats.map((seat) => seat._id);
      await newRoom.save();

      return newRoom;
    } catch (error) {
      throw new Error(`Failed to create room: ${error.message}`);
    }
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
  static validateSeatPosition = (seatRow, seatCol, noOfSeatRow, noOfSeatInEachRow) => {
    if (seatRow < 1 || seatRow > noOfSeatRow) {
      throw new Error(`Seat row (${seatRow}) is out of range (1-${noOfSeatRow}).`);
    }
    if (seatCol < 1 || seatCol > noOfSeatInEachRow) {
      throw new Error(`Seat column (${seatCol}) is out of range (1-${noOfSeatInEachRow}).`);
    }
  };

  // Hàm thêm ghế cho phòng
  static addSeatToRoom = async (roomId, seatRow, seatCol) => {
    const room = await roomModel.findById(roomId);
    if (!room || room.deleted) {
      throw new Error("Room not found or has been deleted.");
    }
    // Kiểm tra nếu vị trí ghế hợp lệ
    RoomService.validateSeatPosition(seatRow, seatCol, room.noOfSeatRow, room.noOfSeatInEachRow);
    // Kiểm tra nếu ghế đã tồn tại trong phòng
    const existingSeat = await seatModel.findOne({ roomId, seatRow, seatCol });
    if (existingSeat) {
      throw new Error(`Seat at row ${seatRow}, column ${seatCol} already exists.`);
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

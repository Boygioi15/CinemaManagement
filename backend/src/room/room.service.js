import roomModel from "./room.schema.js";

export class RoomService {
  static createRoom = async ({
    roomName,
    noOfSeatRow,
    noOfSeatInEachRow,
    centerX1,
    centerX2,
    centerY1,
    centerY2,
  }) => {
    // Initialize an empty array to store the generated seats
    const seats = [];

    // Nested loops to iterate through rows and columns
    for (let i = 1; i <= noOfSeatRow - 1; i++) {
      for (let j = 1; j <= noOfSeatInEachRow; j++) {
        // Generate a random number to decide whether to create a seat (80% chance)
        if (Math.random() <= 0.8) {
          seats.push({
            seatName: `S-${i}-${j}`,
            seatRow: i,
            seatCol: j,
          });
        }
      }
    }
    /*
    seats.push({
      seatName: "P01",
      seatRow: 19,
      seatCol: 1,
    });
    seats.push({
      seatName: "P02",
      seatRow: 19,
      seatCol: 5,
    });
    seats.push({
      seatName: "P03",
      seatRow: 19,
      seatCol: 11,
    });
    */
    // Create and save the room with the generated seats
    const newRoom = new roomModel({
      roomName,
      noOfSeatRow,
      noOfSeatInEachRow,
      seats, // Include the dynamically generated seats
      centerX1,
      centerX2,
      centerY1,
      centerY2,
    });

    // Save the room document to the database
    return await newRoom.save();
  };
}

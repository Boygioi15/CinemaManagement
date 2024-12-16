import { useEffect, useState } from "react";
import { useTicket } from "../Context/TicketContext";
import SeatRow from "./SeatRow";

const seats = [
  {
    seat_row: "A",
    seat_col: 1,
    seat_name: "A01",
    isPair: false,
    isLocked: true,
  },
  {
    seat_row: "A",
    seat_col: 2,
    seat_name: "A02",
    isPair: false,
    isLocked: false,
  },
  {
    seat_row: "K",
    seat_col: 3,
    seat_name: "K03",
    isPair: true,
    isLocked: false,
  },
  {
    seat_row: "K",
    seat_col: 1,
    seat_name: "K01",
    isPair: true,
    isLocked: true,
  },
  {
    seat_row: "K",
    seat_col: 2,
    seat_name: "K02",
    isPair: true,
    isLocked: true,
  },
  {
    seat_row: "B",
    seat_col: 3,
    seat_name: "B03",
    isPair: false,
    isLocked: false,
  },
  // Add more seats as needed
];

const SeatBooking = () => {
  const [rowLabels, setRowLabels] = useState([]);
  const [selectedSeats, setSelectedSeats] = useState([]);

  const [selectedPairSeats, setSelectedPairSeats] = useState([]);

  const [bookedSeats, setBookedSeats] = useState([]);

  const numberOfRows = 11;

  const { ticketQuantities } = useTicket();

  const ticketQuantity = Object.entries(ticketQuantities)
    .filter(([key]) => key !== "pair") // Filter out the 'pair' property
    .reduce((total, [, quantity]) => total + quantity, 0);

  useEffect(() => {
    if (numberOfRows > 0) {
      const labels = Array.from({ length: numberOfRows }, (_, i) =>
        String.fromCharCode(65 + i)
      );
      setRowLabels(labels);
    }
  }, [numberOfRows]);

  useEffect(() => {
    const lockedSeats = seats
      .filter((seat) => seat.isLocked)
      .map((seat) => seat.seat_name);

    if (ticketQuantities.pair === 0) {
      // Nếu không có vé đôi, đánh dấu tất cả các ghế đôi là "booked"
      const pairSeats = seats
        .filter((seat) => seat.isPair)
        .map((seat) => seat.seat_name);
      setBookedSeats([...lockedSeats, ...pairSeats]);
    } else {
      // Nếu có vé đôi, loại bỏ ghế đôi khỏi danh sách "booked"
      const unbookedPairSeats = seats
        .filter((seat) => seat.isPair && !seat.isLocked)
        .map((seat) => seat.seat_name);
      setBookedSeats([
        ...lockedSeats.filter((seat) => !unbookedPairSeats.includes(seat)),
      ]);
    }
  }, [ticketQuantities.pair]);

  const handleSeatSelection = (seatId, isPair) => {
    if (isPair) {
      // Xử lý ghế đôi
      if (selectedPairSeats.includes(seatId)) {
        // Hủy chọn ghế đôi
        setSelectedPairSeats(selectedPairSeats.filter((id) => id !== seatId));
      } else if (selectedPairSeats.length < ticketQuantities.pair) {
        console.log(
          "🚀 ~ handleSeatSelection ~ ticketQuantities.pair:",
          ticketQuantities.pair
        );
        // Chọn ghế đôi (nếu chưa vượt giới hạn số ghế đôi)
        setSelectedPairSeats([...selectedPairSeats, seatId]);
      }
    } else {
      // Xử lý ghế đơn
      if (selectedSeats.includes(seatId)) {
        // Hủy chọn ghế đơn
        setSelectedSeats(selectedSeats.filter((id) => id !== seatId));
      } else if (selectedSeats.length < ticketQuantity) {
        // Chọn ghế đơn (nếu chưa vượt giới hạn số ghế đơn)
        setSelectedSeats([...selectedSeats, seatId]);
      }
    }
  };

  return (
    <div className="flex flex-col items-center p-6 rounded-lg max-w-6xl mx-auto">
      {/* Screen using <hr> with 3D curve effect */}
      <div className="w-full flex justify-center mb-6">
        <hr
          className="w-full h-8 bg-gray-400 rounded-full"
          style={{
            transform: "perspective(800px) rotateX(15deg)", // Apply 3D perspective and curve effect
            boxShadow: "0 10px 20px rgba(0, 0, 0, 0.3)", // Optional shadow to make the effect stand out
          }}
        />
      </div>
      <div className="w-full text-center text-white font-bold flex items-center justify-center">
        Màn hình
      </div>

      {/* Seats (Using flexbox instead of table) */}
      <div className="w-full mt-28">
        {rowLabels.map((rowLabel, index) => {
          const isPairRow = index === rowLabels.length - 1; // Set the last row as paired row
          const currentSeatsPerRow = isPairRow ? 9 : 18; // Use 9 for pair rows, 18 for single rows

          return (
            <SeatRow
              key={rowLabel}
              rowLabel={rowLabel}
              seatsPerRow={currentSeatsPerRow}
              bookedSeats={bookedSeats}
              selectedSeats={selectedSeats}
              selectedPairSeats={selectedPairSeats}
              onSelectSeat={handleSeatSelection}
              isPair={isPairRow} // Pass `true` for the last row to mark it as paired
            />
          );
        })}
      </div>
    </div>
  );
};

export default SeatBooking;

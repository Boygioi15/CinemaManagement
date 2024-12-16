import React, { useEffect, useState } from "react";
import SeatBox from "./SeatBox";

const SeatRow = ({
  rowLabel,
  seatsPerRow,
  bookedSeats,
  selectedSeats,
  selectedPairSeats,
  onSelectSeat,
  isPair,
}) => {
  const [isMobile, setIsMobile] = useState(false);
  const maxInRow = isPair ? 11 : 21;

  const totalInvisibleSeats = maxInRow - seatsPerRow;

  const firstInvisibleSeats = isMobile ? 0 : Math.ceil(totalInvisibleSeats / 2);
  const lastInvisibleSeats = isMobile
    ? 0
    : totalInvisibleSeats - firstInvisibleSeats;
  const allSeats = isMobile ? seatsPerRow : maxInRow;
  let seatNumberCounter = 1;

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 885); // Change breakpoint to 885px
    };

    handleResize(); // Initial resize check
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const seats = [];

  for (let seat = 1; seat <= allSeats; seat++) {
    const seatId = `${rowLabel}${seat < 10 ? `0${seat}` : seat}`;

    const isInvisible =
      seat <= firstInvisibleSeats || seat > allSeats - lastInvisibleSeats;

    if (!isInvisible) {
      const visibleSeatId = `${rowLabel}${
        seatNumberCounter < 10 ? `0${seatNumberCounter}` : seatNumberCounter
      }`;
      seats.push(
        <div key={visibleSeatId} className={`${isMobile ? "p-0" : "p-1"}`}>
          <SeatBox
            seatId={visibleSeatId}
            bookedSeats={bookedSeats}
            selectedSeats={selectedSeats}
            selectedPairSeats={selectedPairSeats}
            onSelectSeat={onSelectSeat}
            isPair={isPair}
          />  
        </div>
      );
      seatNumberCounter++;
    } else {
      seats.push(
        <div
          key={`${seatId}-invisible`}
          className={`${isMobile ? "p-0" : "p-1"}`}
        >
          <SeatBox
            seatId={null} // Không gán mã ghế cho ghế invisible
            bookedSeats={bookedSeats}
            selectedSeats={selectedSeats}
            selectedPairSeats={selectedPairSeats}
            onSelectSeat={onSelectSeat}
            isInvisible={true} // Đánh dấu ghế invisible
            isPair={isPair}
          />
        </div>
      );
    }
  }

  return (
    <div className="relative flex items-center justify-center mb-4">
      {/* Fixed label */}
      <div
        className={`absolute left-0 ${
          isMobile ? "hidden" : "flex"
        } items-center justify-center w-12 font-bold text-xl ${
          isPair ? "mr-14" : "mr-4"
        }`}
        style={{ zIndex: 1, marginRight: isPair ? "3rem" : "1rem" }} // Add margin to the right for space
      >
        {rowLabel}
      </div>
      {/* Seats container with adjusted margin to avoid overlap */}
      <div className={`flex ml-16 ${isMobile ? "gap-1" : "gap-2"}`}>
        {seats}
      </div>{" "}
      {/* ml-16 adds margin to the left of the seats */}
    </div>
  );
};

export default SeatRow;

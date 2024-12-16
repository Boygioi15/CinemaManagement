const SeatBox = ({
  seatId,
  bookedSeats = [],
  selectedSeats = [],
  selectedPairSeats = [],
  onSelectSeat,
  isInvisible,
  isPair, // Thêm isPair vào props
}) => {
  const isBooked = bookedSeats?.includes(seatId) || false;
  const isSelected = isPair
    ? selectedPairSeats?.includes(seatId) || false
    : selectedSeats?.includes(seatId) || false;
  const handleClick = () => {
    if (!isBooked && seatId) {
      onSelectSeat(seatId, isPair); // Only select seat if not booked
    }
  };

  return (
    <div className="flex flex-row">
      {/* Ghế đơn */}
      <div
        onClick={seatId ? handleClick : undefined} // Only clickable if seatId exists
        className={`flex justify-center items-center w-[25px] sm:w-[30px] lg:w-[35px] text-xs lg:text-sm rounded-lg font-interBold p-2 cursor-pointer transition-colors ${
          isBooked
            ? "bg-[#43576d] text-[#979ca3]" // Booked seat
            : isSelected
            ? "bg-mainColor text-secondColor" // Selected seat
            : "bg-white text-secondColor" // Unselected seat
        } ${isInvisible ? "invisible" : ""}`} // Scalable width for different screen sizes
      >
        {seatId || ""} {/* Display seatId only if it exists */}
      </div>

      {/* Render ghế ghép nếu là ghế đôi */}
      <div
        onClick={seatId ? handleClick : undefined} // Only clickable if seatId exists
        className={`flex justify-center items-center w-[25px] sm:w-[30px] lg:w-[35px] text-xs lg:text-sm rounded-lg font-interBold p-2 cursor-pointer transition-colors ${
          isBooked
            ? "bg-[#43576d] text-[#979ca3]" // Booked seat
            : isSelected
            ? "bg-mainColor text-secondColor" // Selected seat
            : "bg-white text-secondColor" // Unselected seat
        } ${isInvisible ? "invisible" : ""} ${!isPair ? "hidden" : "flex"}  `} // Scalable width for pairs
      >
        {seatId || ""} {/* Display seatId only if it exists */}
      </div>
    </div>
  );
};

export default SeatBox;

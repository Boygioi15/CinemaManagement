import React from "react";

const ShowtimeChooseBox = ({ time, isSelected, onClick, }) => {
  return (
    <div
      className={`
        rounded-md px-4 py-5 cursor-pointer w-[61px] h-[34px] flex flex-col justify-center items-center
        ${
          isSelected
            ? "border border-[#f2ea28] text-[#f2ea28]"
            : "border border-white text-white"
        }
      `}
      onClick={onClick}
    >
      <div className="text-base font-semibold">{time}</div>
    </div>
  );
};

export default ShowtimeChooseBox;

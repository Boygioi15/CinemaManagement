import React from "react";
import {
  getDayAndMonthFromISOString,
  getDayOfWeekFromISOString,
} from "../utils/utils";

const ScheduleChooseBox = ({ date, isSelected, onClick }) => {
  return (
    <div
      className={`
        rounded-md px-4 py-5 cursor-pointer w-[103px] h-auto flex flex-col justify-center items-center
        ${
          isSelected
            ? "bg-[#f2ea28] text-[#784c90]"
            : "border border-[#f2ea28] text-[#f2ea28]"
        }
      `}
      onClick={onClick}
    >
      <div className="text-lg font-interBold">
        {getDayAndMonthFromISOString(date)}
      </div>
      <div>{getDayOfWeekFromISOString(date)}</div>
    </div>
  );
};

export default ScheduleChooseBox;

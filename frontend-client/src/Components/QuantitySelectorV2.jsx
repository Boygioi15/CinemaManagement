import { useState } from "react";
import { IoIosAdd } from "react-icons/io";
import { GrFormSubtract } from "react-icons/gr";

const QuantitySelectorV2 = ({
  quantity,
  onIncrement,
  onDecrement
}) => {
  return (
    <div className="flex text-2xl text-black items-center justify-between rounded-md w-[200px] h-[40px] bg-[#94a4b8] hover:bg-[#f2ea28]">
      <button
        type="button"
        className="h-6 w-6 ml-2 rounded-full hover:bg-[#663399] hover:text-[#f2ea28]"
        onClick={onIncrement}
      >
        <GrFormSubtract />
      </button>
      <div
        className="w-full min-h-[35px] text-center justify-center items-center flex"
      >
        {quantity}
      </div>
      <button
        type="button"
        className="h-6 w-6 mr-2 rounded-full hover:bg-[#663399] hover:text-[#f2ea28]"
        onClick={onDecrement}
      >
        <IoIosAdd />
      </button>
    </div>
  );
};

export default QuantitySelectorV2;

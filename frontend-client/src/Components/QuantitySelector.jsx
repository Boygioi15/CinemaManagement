import { useState } from "react";
import { IoIosAdd } from "react-icons/io";
import { GrFormSubtract } from "react-icons/gr";

const QuantitySelector = ({ initialQuantity = 0, onChange }) => {
  const [quantity, setQuantity] = useState(initialQuantity);

  const handleDecrement = () => {
    if (quantity > 1) {
      setQuantity((prevQuantity) => prevQuantity - 1);
      onChange(quantity - 1);
    }
  };

  const handleIncrement = () => {
    setQuantity((prevQuantity) => prevQuantity + 1);
    onChange(quantity + 1);
  };
  const handleInputChange = (event) => {
    const newQuantity = parseInt(event.target.value, 10);
    if (!isNaN(newQuantity) && newQuantity >= 1) {
      setQuantity(newQuantity);
      onChange(newQuantity);
    }
  };
  return (
    <div className="flex text-2xl text-black items-center justify-between rounded-md w-[200px] h-[40px] bg-[#94a4b8] hover:bg-[#f2ea28] ">
      <button
        type="button"
        className=" h-6 w-6 ml-2 rounded-full hover:bg-[#663399] hover:text-[#f2ea28]"
        onClick={handleDecrement}
      >
        <GrFormSubtract />
      </button>
      <div
        className="w-full min-h-[35px] text-center justify-center items-center flex "
        onChange={handleInputChange}
      >
        {quantity}
      </div>
      <button
        type="button"
        className="h-6 w-6 mr-2 rounded-full hover:bg-[#663399] hover:text-[#f2ea28]"
        onClick={handleIncrement}
      >
        <IoIosAdd/>
      </button>
    </div>
  );
};

export default QuantitySelector;

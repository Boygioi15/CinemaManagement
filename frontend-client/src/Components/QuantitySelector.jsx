import { IoIosAdd } from "react-icons/io";
import { GrFormSubtract } from "react-icons/gr";

const QuantitySelector = ({ quantity, updateQuantity, name }) => {
  const handleDecrement = () => {
    if (quantity > 0) {
      updateQuantity(name, quantity - 1); // Cập nhật số lượng trong context
    }
  };

  const handleIncrement = () => {
    updateQuantity(name, quantity + 1); // Cập nhật số lượng trong context
  };

  return (
    <div className="flex text-2xl text-black items-center justify-between rounded-md w-[200px] h-[40px] bg-[#94a4b8] hover:bg-[#f2ea28] ">
      <button
        type="button"
        className="h-6 w-6 ml-2 rounded-full hover:bg-[#663399] hover:text-[#f2ea28]"
        onClick={handleDecrement}
      >
        <GrFormSubtract />
      </button>
      <div className="w-full min-h-[35px] text-center justify-center items-center flex">
        {quantity}
      </div>
      <button
        type="button"
        className="h-6 w-6 mr-2 rounded-full hover:bg-[#663399] hover:text-[#f2ea28]"
        onClick={handleIncrement}
      >
        <IoIosAdd />
      </button>
    </div>
  );
};

export default QuantitySelector;

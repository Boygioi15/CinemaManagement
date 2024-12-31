import { useState } from "react";
import { IoIosAdd } from "react-icons/io";
import { GrFormSubtract } from "react-icons/gr";

const QuantitySelector = ({
  initialQuantity = 0,
  food,
  selectedFood,
  setSelectedFood,
}) => {
  const [quantity, setQuantity] = useState(initialQuantity);

  const updateSelectedFood = (newQuantity) => {
    if (setSelectedFood) {
      const updatedFoodList = [...selectedFood];

      const foodIndex = updatedFoodList.findIndex(
        (item) => item._id === food._id
      );

      if (newQuantity > 0) {
        if (foodIndex >= 0) {
          updatedFoodList[foodIndex].quantity = newQuantity;
        } else {
          updatedFoodList.push({
            name: food.name,
            quantity: newQuantity,
            _id: food._id,
            price: food.price,
          });
        }
      } else if (foodIndex >= 0) {
        updatedFoodList.splice(foodIndex, 1);
      }

      setSelectedFood(updatedFoodList);
    }
  };

  const handleDecrement = () => {
    if (quantity > 0) {
      const newQuantity = quantity - 1;
      setQuantity(newQuantity);
      updateSelectedFood(newQuantity);
    }
  };

  const handleIncrement = () => {
    const newQuantity = quantity + 1;
    setQuantity(newQuantity);
    updateSelectedFood(newQuantity);
  };

  const handleInputChange = (event) => {
    const newQuantity = parseInt(event.target.value, 10);
    if (!isNaN(newQuantity) && newQuantity >= 0) {
      setQuantity(newQuantity);
      updateSelectedFood(newQuantity);
    }
  };

  return (
    <div className="flex text-2xl text-black items-center justify-between rounded-md w-[200px] h-[40px] bg-[#94a4b8] hover:bg-[#f2ea28]">
      <button
        type="button"
        className="h-6 w-6 ml-2 rounded-full hover:bg-[#663399] hover:text-[#f2ea28]"
        onClick={handleDecrement}
      >
        <GrFormSubtract />
      </button>
      <div
        className="w-full min-h-[35px] text-center justify-center items-center flex"
        onChange={handleInputChange}
      >
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

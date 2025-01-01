import QuantitySelector from "./QuantitySelector";

const FoodCard = ({ food, setSelectedFood, selectedFood }) => {
  return (
    <div>
      <div className="flex flex-col justify-between md:grid md:grid-cols-2 gap-4 group">
        <div className="md:col-span-1 w-full">
          <img
            className="w-[240px] h-[240px] object-cover rounded-md"
            src={food.thumbnailURL}
            alt={food.name || "Food Thumbnail"}
          />
        </div>

        <div className="md:col-span-1 flex flex-col justify-between">
          <div className="flex flex-col font-interBold gap-4 justify-center items-center md:items-start">
            <span className="text-lg font-bold text-white-800 break-words max-w-[200px]">
              {food?.name || "Tên món ăn"}
            </span>
            <span className="text-lg text-white-600">
              {food?.price
                ? `${food.price.toLocaleString()} VNĐ`
                : "Không có giá"}
            </span>
          </div>

          <div className="mt-4">
            <QuantitySelector
              food={food}
              setSelectedFood={setSelectedFood}
              selectedFood={selectedFood}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default FoodCard;

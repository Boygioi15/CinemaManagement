import FoodCard from "./FoodCard/FoodCard";

const FoodSection = ({ foods, setSelectedFood, selectedFood }) => {
  return (
    <div className="flex flex-col justify-center items-center">
      <h1 className="font-interExtraBold">COMBO</h1>
      <div className="flex flex-wrap justify-center mt-20 items-center gap-4 md:gap-12">
        {foods.map((food) => {
          return (
            <FoodCard
              food={food}
              setSelectedFood={setSelectedFood}
              selectedFood={selectedFood}
            />
          );
        })}
      </div>
    </div>
  );
};

export default FoodSection;

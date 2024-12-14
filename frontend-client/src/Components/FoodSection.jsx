import FoodCard from "./FoodCard";

const FoodSection = () => {
  return (
    <div className="flex flex-col justify-center items-center">
      <h1 className="font-interExtraBold">COMBO</h1>
      <div className="flex flex-wrap justify-center mt-20 items-center gap-4 md:gap-12">
        <FoodCard />
        <FoodCard />
        <FoodCard />
        <FoodCard />
      </div>
    </div>
  );
};

export default FoodSection;

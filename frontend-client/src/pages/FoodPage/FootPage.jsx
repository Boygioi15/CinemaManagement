import { useEffect, useState } from "react";
import FoodSection from "../../Components/FoodSection";
import PaymentSection from "../../Components/PaymentSection/PaymentSection";
import { getAllFoods } from "../../config/api";

const FoodPage = () => {
  const [foods, setFoods] = useState([]);
  const [selectedFood, setSelectedFood] = useState([]);
  console.log("🚀 ~ FoodPage ~ selectedFood:", selectedFood);

  const fetchAllFood = async () => {
    const response = await getAllFoods();
    if (response.success) {
      setFoods(response.data);
    }
  };
  useEffect(() => {
    document.title = "Đặt bắp nước";
    fetchAllFood();
  }, []);
  return (
    <div>
      <div className="flex flex-col gap-56 py-20 h-full">
        <FoodSection
          foods={foods}
          setSelectedFood={setSelectedFood}
          selectedFood={selectedFood}
        />
      </div>
      <PaymentSection selectedFood={selectedFood} />
    </div>
  );
};
export default FoodPage;

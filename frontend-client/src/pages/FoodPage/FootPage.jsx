import { useEffect, useState } from "react";
import { FaArrowLeft } from "react-icons/fa";
import FoodSection from "../../Components/FoodSection";
import PaymentSection from "../../Components/PaymentSection/PaymentSection";
import { getAllFoods } from "../../config/api";
import PromotionList from "../../Components/PromotionList";

const FoodPage = () => {
  const [foods, setFoods] = useState([]);
  const [selectedFood, setSelectedFood] = useState([]);
  const [isPromotionListOpen, setIsPromotionListOpen] = useState(false);
  const [selectedPromotions, setSelectedPromotions] = useState([]);
  const [totalDiscount, setTotalDiscount] = useState(0);

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
    <div className="relative">
      <div className="flex flex-col gap-56 py-20 h-full">
        <FoodSection
          foods={foods}
          setSelectedFood={setSelectedFood}
          selectedFood={selectedFood}
        />
      </div>
      {/* Truyền selectedPromotions và totalDiscount vào PaymentSection */}
      <PaymentSection
        selectedFood={selectedFood}
        selectedPromotions={selectedPromotions}
        totalDiscount={totalDiscount}
      />

      {/* Sidebar (PromotionList) */}
      <PromotionList
        isOpen={isPromotionListOpen}
        setIsOpen={setIsPromotionListOpen}
        onApplyPromotions={(selectedPromotions, totalDiscount) => {
          setSelectedPromotions(selectedPromotions);
          setTotalDiscount(totalDiscount);
        }}
      />

      {/* Nút mở sidebar */}
      {!isPromotionListOpen && (
        <button
          onClick={() => setIsPromotionListOpen(true)}
          className="fixed inset-y-1/2 right-0 transform -translate-y-1/2 text-white px-4 py-2 rounded-l-lg shadow-lg flex items-center justify-center"
        >
          <FaArrowLeft size={20} />
        </button>
      )}
    </div>
  );
};

export default FoodPage;

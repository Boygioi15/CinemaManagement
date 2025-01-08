import { useEffect, useState } from "react";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa"; // Import biểu tượng mũi tên
import FoodSection from "../../Components/FoodSection";
import PaymentSection from "../../Components/PaymentSection/PaymentSection";
import { getAllFoods } from "../../config/api";
import PromotionList from "../../Components/PromotionList";

const FoodPage = () => {
  const [foods, setFoods] = useState([]);
  const [selectedFood, setSelectedFood] = useState([]);
  const [isPromotionListOpen, setIsPromotionListOpen] = useState(false); // Trạng thái PromotionList

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
      <PaymentSection selectedFood={selectedFood} />

      {/* Sidebar (PromotionList) */}

      <PromotionList
        isOpen={isPromotionListOpen}
        setIsOpen={setIsPromotionListOpen}
        onApplyPromotions={(selectedPromotions) => {
          console.log("Các khuyến mãi đã chọn:", selectedPromotions);
          // Xử lý hoặc lưu trữ danh sách khuyến mãi
        }}
      />

      {/* Nút mở sidebar */}
      {!isPromotionListOpen && (
        <button
          onClick={() => setIsPromotionListOpen(true)}
          className="fixed inset-y-1/2 right-0 transform -translate-y-1/2 text-white px-4 py-2 rounded-l-lg shadow-lg  flex items-center justify-center"
        >
          <FaArrowLeft size={20} />
        </button>
      )}
    </div>
  );
};

export default FoodPage;

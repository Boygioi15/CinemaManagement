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
      <PaymentSection selectedFood={selectedFood} />

      {/* Sidebar (PromotionList) */}
      <PromotionList
        isOpen={isPromotionListOpen}
        setIsOpen={setIsPromotionListOpen}
        onApplyPromotions={(selectedPromotions, totalDiscount) => {
          setSelectedPromotions(selectedPromotions);
          setTotalDiscount(totalDiscount);
        }}
      />

      {/* Hiển thị thông tin khuyến mãi */}
      <div className="mt-6">
        <h3>Danh sách khuyến mãi đã chọn:</h3>
        <ul>
          {selectedPromotions.map((promo) => (
            <li key={promo._id}>{promo.name} - Giảm {promo.discountRate}%</li>
          ))}
        </ul>
        <p className="text-lg font-bold text-red-500 mt-4">
          Tổng khuyến mãi: {totalDiscount}%
        </p>
      </div>

      {/* Nút mở sidebar */}
      {!isPromotionListOpen && (
        <button
          onClick={() => setIsPromotionListOpen(true)}
          className="fixed inset-y-1/2 right-0 transform -translate-y-1/2 text-white px-4 py-2 rounded-l-lg shadow-lg  flex items-center justify-center bg-red-500 hover:bg-red-600"
        >
          <FaArrowLeft size={20} />
        </button>
      )}
    </div>
  );
};

export default FoodPage;

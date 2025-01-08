import React, { useState, useEffect } from "react";
import { X, Plus, Check } from "lucide-react";
import { getAllPromotion } from "../config/api";

const PromotionList = ({ isOpen, setIsOpen, onApplyPromotions }) => {
  const [promotionList, setPromotionList] = useState([]); // Danh sách ưu đãi
  const [selectedPromotions, setSelectedPromotions] = useState([]); // Danh sách ưu đãi được chọn
  const [isAnimating, setIsAnimating] = useState(false); // Trạng thái hoạt ảnh

  // Giả lập API để trả về danh sách ưu đãi
  const fetchPromotionList = async () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([
          {
            id: "1",
            image: "https://via.placeholder.com/150",
            name: "Giảm giá 10%",
            discount: "10%",
          },
          {
            id: "2",
            image: "https://via.placeholder.com/150",
            name: "Giảm giá 20%",
            discount: "20%",
          },
          {
            id: "3",
            image: "https://via.placeholder.com/150",
            name: "Giảm giá 50%",
            discount: "50%",
          },
        ]);
      }, 1000); // Giả lập thời gian chờ 1 giây
    });
  };
  const handleGetAllPromotion = async () => {
    const response = await getAllPromotion();
    console.log("🚀 ~ handleGetAllPromotion ~ response:", response);
  };
  useEffect(() => {
    if (isOpen) {
      handleGetAllPromotion();
      const fetchData = async () => {
        const data = await fetchPromotionList();
        setPromotionList(data);
      };
      fetchData();
      setIsAnimating(true); // Kích hoạt hiệu ứng mở
    } else {
      setIsAnimating(false); // Kích hoạt hiệu ứng đóng
    }
  }, [isOpen]);

  const handleClose = () => {
    setIsAnimating(false); // Bắt đầu hiệu ứng đóng
    setTimeout(() => setIsOpen(false), 300); // Đợi hiệu ứng hoàn tất rồi đóng
  };

  const handleTogglePromotion = (promotionId) => {
    setSelectedPromotions((prev) => {
      const promotion = promotionList.find((promo) => promo.id === promotionId);
      if (!promotion) return prev;

      return prev.some((promo) => promo.id === promotionId)
        ? prev.filter((promo) => promo.id !== promotionId)
        : [...prev, promotion];
    });
  };

  const calculateTotalDiscount = () => {
    return selectedPromotions
      .map((promo) => parseInt(promo.discount, 10))
      .reduce((sum, value) => sum + value, 0);
  };

  const handleApplyPromotions = () => {
    if (onApplyPromotions) {
      onApplyPromotions(selectedPromotions); // Gửi toàn bộ thông tin đã chọn
    }
    handleClose();
  };

  const PromotionItem = ({ promotion }) => (
    <div
      className={`group flex items-start gap-4 p-5 rounded-lg transition-all duration-200 shadow-sm hover:shadow-md ${
        selectedPromotions.some((promo) => promo.id === promotion.id)
          ? "bg-red-50 border-2 border-red-500"
          : "bg-gray-50 hover:bg-gray-100"
      }`}
      onClick={() => handleTogglePromotion(promotion.id)}
    >
      <img
        src={promotion.image}
        alt={promotion.name}
        className="w-20 h-20 object-cover rounded-lg"
      />
      <div className="flex-1 min-w-0">
        <p className="text-lg font-medium text-gray-900 leading-6">
          {promotion.name}
        </p>
        <p className="text-base text-red-500 mt-2 leading-6">
          Giảm {promotion.discount}
        </p>
      </div>
      <div
        className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
          selectedPromotions.some((promo) => promo.id === promotion.id)
            ? "bg-red-500"
            : "border-2 border-gray-300 group-hover:border-gray-400"
        }`}
      >
        {selectedPromotions.some((promo) => promo.id === promotion.id) ? (
          <Check className="w-5 h-5 text-white" />
        ) : (
          <Plus className="w-5 h-5 text-gray-400" />
        )}
      </div>
    </div>
  );

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300"
            onClick={handleClose}
          />

          <div
            className={`fixed right-0 top-0 h-full w-full sm:w-[480px] bg-white shadow-2xl flex flex-col z-50 transform transition-transform duration-300 ${
              isAnimating ? "translate-x-0" : "translate-x-full"
            }`}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b bg-white">
              <h2 className="text-xl font-semibold">Khuyến mãi và ưu đãi</h2>
              <button
                onClick={handleClose}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-6 h-6 text-gray-500" />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto px-6 pb-6">
              <h3 className="text-lg font-semibold mb-6">
                Khuyến mãi khả dụng
              </h3>
              <div className="space-y-4">
                {promotionList.map((promotion) => (
                  <PromotionItem key={promotion.id} promotion={promotion} />
                ))}
              </div>
            </div>

            {/* Footer */}
            <div className="border-t bg-white p-6 shadow-lg">
              <div className="flex flex-col items-start">
                <p className="text-lg font-medium text-gray-700">
                  Tổng khuyến mãi:{" "}
                  <span className="text-red-500 font-semibold">
                    {calculateTotalDiscount()}%
                  </span>
                </p>
              </div>
              <div className="flex justify-between items-center mt-6">
                <button
                  onClick={handleApplyPromotions}
                  className="bg-green-500 hover:bg-green-600 text-white px-8 py-3 rounded-lg font-medium transition-colors shadow-sm hover:shadow-md text-lg"
                >
                  Áp dụng
                </button>
                <button
                  onClick={handleClose}
                  className="bg-red-500 hover:bg-red-600 text-white px-8 py-3 rounded-lg font-medium transition-colors shadow-sm hover:shadow-md text-lg"
                >
                  Đóng
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default PromotionList;

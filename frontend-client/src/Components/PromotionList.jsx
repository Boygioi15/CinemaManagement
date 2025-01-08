import React, { useState, useEffect } from "react";
import { X, Plus, Check } from "lucide-react";
import { getAllPromotion } from "../config/api";

const PromotionList = ({ isOpen, setIsOpen, onApplyPromotions }) => {
  const [promotionList, setPromotionList] = useState([]); // Danh sách ưu đãi
  const [selectedPromotions, setSelectedPromotions] = useState([]); // Danh sách chính thức
  const [tempSelectedPromotions, setTempSelectedPromotions] = useState([]); // Danh sách tạm thời
  const [isAnimating, setIsAnimating] = useState(false); // Trạng thái hoạt ảnh

  const handleGetAllPromotion = async () => {
    try {
      const response = await getAllPromotion();
      if (response.success) {
        setPromotionList(response.data);
      } else {
        console.error("Failed to fetch promotions:", response.msg);
      }
    } catch (error) {
      console.error("Error fetching promotions:", error);
    }
  };

  useEffect(() => {
    if (isOpen) {
      handleGetAllPromotion();
      setTempSelectedPromotions(selectedPromotions); // Đồng bộ danh sách tạm thời
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
    setTempSelectedPromotions((prev) => {
      const promotion = promotionList.find(
        (promo) => promo._id === promotionId
      );
      if (!promotion) return prev;

      return prev.some((promo) => promo._id === promotionId)
        ? prev.filter((promo) => promo._id !== promotionId)
        : [...prev, promotion];
    });
  };

  const calculateTotalDiscount = () => {
    return tempSelectedPromotions
      .map((promo) => parseInt(promo.discountRate, 10))
      .reduce((sum, value) => sum + value, 0);
  };

  const handleApplyPromotions = () => {
    const totalDiscount = calculateTotalDiscount();
    setSelectedPromotions(tempSelectedPromotions); // Cập nhật danh sách chính thức
    if (onApplyPromotions) {
      onApplyPromotions(tempSelectedPromotions, totalDiscount); // Gửi danh sách và tổng discount ra ngoài
    }
    handleClose();
  };

  const PromotionItem = ({ promotion }) => (
    <div
      className={`group flex items-start gap-4 p-5 rounded-lg transition-all duration-200 shadow-sm hover:shadow-md ${
        tempSelectedPromotions.some((promo) => promo._id === promotion._id)
          ? "bg-red-50 border-2 border-red-500"
          : "bg-gray-50 hover:bg-gray-100"
      }`}
      onClick={() => handleTogglePromotion(promotion._id)}
    >
      <img
        src={promotion.thumbnailURL}
        alt={promotion.name}
        className="w-20 h-20 object-cover rounded-lg"
      />
      <div className="flex-1 min-w-0">
        <p className="text-lg font-medium text-gray-900 leading-6">
          {promotion.name}
        </p>
        <p className="text-base text-red-500 mt-2 leading-6">
          Giảm {promotion.discountRate}%
        </p>
      </div>
      <div
        className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
          tempSelectedPromotions.some((promo) => promo._id === promotion._id)
            ? "bg-red-500"
            : "border-2 border-gray-300 group-hover:border-gray-400"
        }`}
      >
        {tempSelectedPromotions.some((promo) => promo._id === promotion._id) ? (
          <Check className="w-5 h-5 text-white" />
        ) : (
          <Plus className="w-5 h-5 text-gray-400" />
        )}
      </div>
    </div>
  );

  return (
    <div>
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
              <h2 className="text-xl text-black font-semibold">
                Khuyến mãi và ưu đãi
              </h2>
              <button
                onClick={handleClose}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-6 h-6 text-gray-500" />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto px-6 pb-6">
              <div className="space-y-4 mt-4">
                {promotionList.map((promotion) => (
                  <PromotionItem key={promotion._id} promotion={promotion} />
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
    </div>
  );
};

export default PromotionList;

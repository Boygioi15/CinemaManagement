import React, { useState } from "react";
import CustomButton from "../button/index"; // Giả sử bạn đã có CustomButton component

const PaymentSection = ({ selectedFood }) => {
  const [isShowing, setIsShowing] = useState(true);
  const totalPrice = selectedFood.reduce(
    (sum, food) => sum + food.quantity * food.price,
    0
  );
  return (
    <div className="flex justify-between items-center px-24 bg-[#0f172a] text-white sticky bottom-0 py-4">
      {/* Phần Hóa đơn */}
      <div className="flex flex-col items-start max-w-xl w-full">
        <h1 className="text-3xl font-bold">HÓA ĐƠN</h1>
        {selectedFood.map((food) => {
          return (
            <p className="text-lg mt-2 break-words w-full">
              <span className="block">{food.name}</span>
              <span className="text-gray-500"> x{food.quantity}</span>
            </p>
          );
        })}
      </div>

      <div className="flex flex-col items-end max-w-md w-full border-l-2 pl-6 py-4">
        <div className="flex justify-between w-full ">
          <p className="text-lg">Tạm tính</p>
          <p className="text-xl font-bold">{totalPrice.toLocaleString()} VNĐ</p>
        </div>

        {/* Nút Thanh toán */}
        <div className="w-full mt-2">
          <CustomButton
            defaultColor=""
            gradientFrom="#EE772E"
            gradientTo="#F6C343"
            textColor="#FFFFFF"
            hoverTextColor="#FFFFFF"
            borderColor="#FFFFFF"
            href="#"
            className="w-full h-[40px] text-lg mt-4"
            text={isShowing ? "Đặt ngay" : "Tìm hiểu thêm"}
          />
        </div>
      </div>
    </div>
  );
};

export default PaymentSection;

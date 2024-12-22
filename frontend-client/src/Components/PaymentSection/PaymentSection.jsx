import React, { useState } from "react";
import CustomButton from "../button/index"; // Giả sử bạn đã có CustomButton component

const PaymentSection = () => {
  const [isShowing, setIsShowing] = useState(true);

  return (
    <div className="flex justify-between items-center px-24 bg-[#0f172a] text-white sticky bottom-0 py-4">
      {/* Phần Hóa đơn */}
      <div className="flex flex-col items-start max-w-sm w-full">
        <h1 className="text-3xl font-bold">HÓA ĐƠN</h1>
        <p className="text-lg mt-2">1 Poca Khoai Tây 54gr</p>
      </div>

      {/* Phần Thông tin thanh toán */}
      <div className="flex flex-col items-end max-w-md w-full border-l-2 pl-6 py-4">
        {/* Phần Tạm tính */}
        <div className="flex justify-between w-full ">
          <p className="text-lg">Tạm tính</p>
          <p className="text-xl font-bold">28,000 VNĐ</p>
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
            text={isShowing ? "Đặt vé" : "Tìm hiểu thêm"}
          />
        </div>
      </div>
    </div>
  );
};

export default PaymentSection;

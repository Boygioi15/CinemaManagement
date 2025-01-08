import React, { useEffect, useState } from "react";
import CustomButton from "../button/index"; // Giả sử bạn đã có CustomButton component
import { createPayment, getCurrentPro } from "../../config/api"; // Đảm bảo createPayment được định nghĩa đúng
import { useAuth } from "../../Context/AuthContext"; // Dùng context cho user

const PaymentSection = ({
  selectedFood,
  selectedPromotions,
  totalDiscount,
}) => {
  const [isLoading, setIsLoading] = useState(false); // State quản lý trạng thái loading
  const [paymentUrl, setPaymentUrl] = useState(null); // State quản lý URL thanh toán
  const [pro, setPro] = useState(null);
  const totalPrice = selectedFood.reduce(
    (sum, food) => sum + food.quantity * food.price,
    0
  );

  const additionalItems = selectedFood.map((food) => {
    return {
      _id: food._id,
      quantity: food.quantity,
    };
  });
  console.log("🚀 ~ additionalItems ~ additionalItems:", additionalItems);
  const handleGetPro = async () => {
    const response = await getCurrentPro(Date.now());
    setPro(response.data[0]);
  };
  useEffect(() => {
    handleGetPro();
  }, []);
  // Lấy danh sách ID từ selectedPromotions
  const promotionIds = selectedPromotions.map((promo) => promo._id);
  // Hàm xử lý thanh toán
  const handleCreatePayment = async () => {
    setIsLoading(true); // Bật trạng thái loading khi bắt đầu gửi yêu cầu
    try {
      if (!localStorage.getItem("accessToken")) {
        alert("Bạn cần phải đăng nhập trước khi thực hiện thanh toán");
        navigate("/auth");
      }
      const response = await createPayment({
        additionalItemSelections: additionalItems,
        totalPrice,
        promotionIDs: promotionIds,
      });

      if (response && response.payUrl) {
        setPaymentUrl(response.payUrl);
        window.location.href = response.payUrl;
      } else {
        alert("Chưa chọn sản phẩm");
      }
    } catch (error) {
      console.error("Lỗi khi tạo thanh toán:", error);
      alert("Có lỗi xảy ra. Vui lòng thử lại.");
    } finally {
      setIsLoading(false); // Tắt trạng thái loading sau khi xong
    }
  };

  return (
    <>
      {additionalItems.length > 0 && (
        <div className="flex justify-between items-center px-24 bg-[#0f172a] text-white sticky bottom-0 py-4">
          {/* Phần Hóa đơn */}
          <div className="flex flex-col items-start max-w-xl w-full">
            <h1 className="text-3xl font-bold">HÓA ĐƠN</h1>
            {selectedFood.map((food) => (
              <p
                style={{
                  display: "flex",
                  flexDirection: "row ",
                  gap: "5px",
                  fontSize: "18px",
                }}
                className="text-lg mt-2 break-words w-full"
                key={food._id}
              >
                <span style={{ color: "#F3EA28" }} className="text-gray-500">
                  {" "}
                  x{food.quantity}
                </span>
                <span className="block">{food.name}</span>
              </p>
            ))}
          </div>

          <div className="flex flex-col items-end max-w-md w-full border-l-2 pl-6 py-4">
            <div className="flex flex-col  w-full ">
              <p className="text-lg">Tạm tính</p>
              <p className="text-xl font-bold">
                {totalPrice.toLocaleString()} VNĐ
              </p>
              <p className="text-lg">Khuyến mãi</p>
              <p className="text-xl font-bold">{+totalDiscount} %</p>
              <p className="text-lg">Tổng tiền</p>
              <p className="text-xl font-bold">
                {(
                  totalPrice -
                  (totalPrice * +totalDiscount) / 100
                ).toLocaleString()}
                VNĐ
              </p>
            </div>

            <div className="w-full mt-2">
              <CustomButton
                defaultColor=""
                gradientFrom="#EE772E"
                gradientTo="#F6C343"
                textColor="#FFFFFF"
                hoverTextColor="#FFFFFF"
                borderColor="#FFFFFF"
                handleCreatePayment={handleCreatePayment} // Truyền sự kiện vào button
                href="#"
                className="w-full h-[40px] text-lg mt-4"
                text={isLoading ? "Đang xử lý..." : "Đặt ngay"} // Hiển thị text thay đổi khi đang xử lý
                disabled={isLoading} // Vô hiệu hóa nút khi đang xử lý
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default PaymentSection;

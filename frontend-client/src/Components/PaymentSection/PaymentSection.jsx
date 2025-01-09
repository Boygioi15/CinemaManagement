import React, { useEffect, useState } from "react";
import CustomButton from "../button/index"; // Giả sử bạn đã có CustomButton component
import { createPayment, getCurrentPoint, getParam } from "../../config/api"; // Đảm bảo các API được định nghĩa đúng
import { useAuth } from "../../Context/AuthContext"; // Dùng context cho user
import { useNavigate } from "react-router-dom";

const PaymentSection = ({
  selectedFood,
  selectedPromotions,
  totalDiscount,
}) => {
  const [isLoading, setIsLoading] = useState(false); // State quản lý trạng thái loading
  const [paymentUrl, setPaymentUrl] = useState(null); // State quản lý URL thanh toán
  const [loyalPoint, setLoyalPoint] = useState(0); // Điểm tích lũy hiện tại
  const [param, setParam] = useState(null); // Tham số từ hệ thống
  console.log("🚀 ~ param:", param);
  const [usePoints, setUsePoints] = useState(false); // Sử dụng điểm
  const [pointUsage, setPointUsage] = useState(null); // Số điểm sẽ sử dụng
  console.log("🚀 ~ pointUsage:", pointUsage);

  const { user } = useAuth(); // Lấy thông tin user từ context
  const navigate = useNavigate();

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

  // Lấy danh sách ID từ selectedPromotions
  const promotionIds = selectedPromotions.map((promo) => promo._id);

  const handleCreatePayment = async () => {
    setIsLoading(true); // Bật trạng thái loading khi bắt đầu gửi yêu cầu
    try {
      if (!localStorage.getItem("accessToken")) {
        alert("Bạn cần phải đăng nhập trước khi thực hiện thanh toán");
        navigate("/auth");
        return;
      }

      const response = await createPayment({
        additionalItemSelections: additionalItems,
        totalPrice,
        promotionIDs: promotionIds,
        pointUsage: usePoints ? pointUsage : null, // Gửi số điểm sử dụng nếu có
      });

      if (response && response.payUrl) {
        setPaymentUrl(response.payUrl);
        window.location.href = response.payUrl;
      } else {
        alert(response.message || "Chưa chọn sản phẩm");
      }
    } catch (error) {
      console.error("Lỗi khi tạo thanh toán:", error);
      alert("Có lỗi xảy ra. Vui lòng thử lại.");
    } finally {
      setIsLoading(false); // Tắt trạng thái loading sau khi xong
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      const pointResponse = await getCurrentPoint();
      setLoyalPoint(pointResponse.data.currentLoyalPoint);

      const paramResponse = await getParam();
      setParam(paramResponse.data);
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (!param) return;
    if (!usePoints) {
      setPointUsage(null);
      return;
    }
    const data = Math.min(
      totalPrice -
        (totalPrice * totalDiscount) /
          100 /
          param.loyalPoint_PointToReducedPriceRatio,
      param.loyalPoint_MaxiumPointUseInOneGo
    );

    const calculatedPointUsage = Math.min(data, loyalPoint);

    setPointUsage(calculatedPointUsage);
  }, [usePoints, totalPrice, totalDiscount, param]);

  const handleTogglePoints = () => {
    if (usePoints === false && loyalPoint === 0) {
      alert(`Bạn không có điểm để sử dụng`);
      return;
    }

    if (
      !usePoints &&
      totalPrice < param?.loyalPoint_MiniumValueToUseLoyalPoint
    ) {
      alert(
        `Để có thể sử dụng điểm tích lũy, đơn hàng tối thiểu phải là: ${param.loyalPoint_MiniumValueToUseLoyalPoint.toLocaleString()} VNĐ`
      );
      return;
    } else if (
      loyalPoint > param.loyalPoint_MaxiumPointUseInOneGo &&
      !usePoints
    ) {
      alert(
        `Điểm sử dụng tối đa trong một lần là ${param.loyalPoint_MaxiumPointUseInOneGo}. Phần dư ra có thể được sử dụng lại cho lần sau.`
      );
    }
    setUsePoints(!usePoints);
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
                  flexDirection: "row",
                  gap: "5px",
                  fontSize: "18px",
                }}
                className="text-lg mt-2 break-words w-full"
                key={food._id}
              >
                <span style={{ color: "#F3EA28" }} className="text-gray-500">
                  x{food.quantity}
                </span>
                <span className="block">{food.name}</span>
              </p>
            ))}
          </div>

          <div className="flex flex-col items-end max-w-md w-full border-l-2 pl-6 py-4">
            <div className="flex flex-col w-full">
              <div className="grid grid-cols-2 gap-36 w-full">
                <div className="flex flex-col w-full">
                  <p className="text-lg">Tạm tính</p>
                  <p className="text-xl font-bold">
                    {totalPrice.toLocaleString()} VNĐ
                  </p>
                  <p className="text-lg">Tổng tiền</p>
                  <p className="text-xl font-bold">
                    {!usePoints
                      ? (
                          totalPrice -
                          (totalPrice * totalDiscount) / 100
                        ).toLocaleString()
                      : (totalPrice -
                          (totalPrice * totalDiscount) / 100 -
                          (pointUsage *
                            param.loyalPoint_PointToReducedPriceRatio) /
                            100 <
                        0
                          ? 0
                          : totalPrice -
                            (totalPrice * totalDiscount) / 100 -
                            (pointUsage *
                              param.loyalPoint_PointToReducedPriceRatio) /
                              100
                        ).toLocaleString()}
                    VNĐ
                  </p>
                </div>
                <div className="flex flex-col w-full">
                  <p className="text-lg">Khuyến mãi</p>
                  <p className="text-xl font-bold">{+totalDiscount} %</p>
                  <p className="text-lg">Điểm tích được</p>
                  <p className="text-xl font-bold">
                    {
                      +Math.floor(
                        (totalPrice * param.loyalPoint_OrderToPointRatio) / 100
                      )
                    }
                  </p>
                </div>
              </div>
              <div className="flex justify-between items-center mt-4">
                <p className="text-lg">Sử dụng điểm</p>
                <label className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="hidden"
                    checked={usePoints}
                    onChange={handleTogglePoints}
                  />
                  <span
                    className={`w-10 h-5 flex items-center rounded-full p-1 ${
                      usePoints ? "bg-green-500" : "bg-gray-300"
                    }`}
                  >
                    <span
                      className={`bg-white w-4 h-4 rounded-full shadow-md transform duration-300 ${
                        usePoints ? "translate-x-5" : "translate-x-0"
                      }`}
                    ></span>
                  </span>
                  <span className="ml-3 text-lg">
                    {loyalPoint.toLocaleString()} điểm
                  </span>
                </label>
              </div>
              {pointUsage && (
                <div className="flex justify-between items-center mt-4">
                  <p className="text-lg">Đã sử dụng</p>

                  <span className="ml-3 text-lg">
                    {pointUsage.toLocaleString()} điểm
                  </span>
                </div>
              )}
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

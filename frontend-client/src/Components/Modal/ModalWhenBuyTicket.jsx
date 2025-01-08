import React from "react";
import "./style.css"; // Add your modal styles here
import CustomButton from "../button/index";

const ModalWhenBuyTicket = ({ isOpen, onClose }) => {
  if (!isOpen) return null;
  return (
    <div className="modal-overlay text-xl">
      <div style={{ backgroundColor: "#0D1831" }} className="modal-content">
        <h1>Thông báo</h1>
        <p className="">
          Nếu mua vé HSSV, vui lòng xuất trình giấy tờ xác nhận khi nhận vé.Nhân
          viên rạp có thể từ chối không cho bạn vào xem nếu không thực hiện đúng
          quy định này. Trân trọng cảm ơn
        </p>
        <CustomButton
          defaultColor="#F3EA28" /* Default background color */
          gradientFrom="#663399" /* Gradient start color */
          gradientTo="#3366CC" /* Gradient end color */
          textColor="#000000" /* Text color */
          hoverTextColor="#FFFFFF" /* Text color on hover */
          text="Tôi đã hiểu và tiếp tục"
          onClick={onClose}
        />
      </div>
    </div>
  );
};
export { ModalWhenBuyTicket };

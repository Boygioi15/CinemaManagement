import "../../style/customButton.css";
import { useState } from "react";

const CustomButton = ({
  defaultColor, // Nền mặc định
  gradientFrom, // Gradient bắt đầu
  gradientTo, // Gradient kết thúc
  textColor, // Màu chữ mặc định
  hoverTextColor, // Màu chữ khi hover
  borderColor, // Viền
  href, // Liên kết
  className,
  text, // Văn bản của button
  handleCreatePayment, // Hàm xử lý thanh toán
  onClick,
  disabled, // Trạng thái disabled
}) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <a
      href={href}
      className={`custom-button ${className} hover:text-[${hoverTextColor}]`}
      style={{
        color: isHovered ? hoverTextColor : textColor,
        border: borderColor ? `2px solid ${borderColor}` : "none",
        pointerEvents: disabled ? "none" : "auto", // Vô hiệu hóa khi disabled
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={()=>{
        handleCreatePayment && handleCreatePayment()
        onClick && onClick()
      }} // Gọi sự kiện khi click
    >
      <div
        className="button-background-default"
        style={{ backgroundColor: defaultColor }}
      ></div>
      <div
        className="button-background-hover"
        style={{
          background: `linear-gradient(to right, ${gradientFrom}, ${gradientTo})`,
        }}
      ></div>
      <span className="button-text">{text}</span>
    </a>
  );
};

export default CustomButton;

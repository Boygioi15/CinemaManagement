import "../../style/customButton.css";
import { useState } from "react";

const CustomButton = ({
  defaultColor, // Nền mặc định là trong suốt nếu không truyền vào
  gradientFrom, // Gradient bắt đầu từ trong suốt nếu không truyền vào
  gradientTo, // Gradient kết thúc cũng trong suốt
  textColor, // Màu chữ mặc định là đen
  hoverTextColor, // Màu chữ khi hover là trắng
  borderColor, // Viền mặc định là không có
  href, // Liên kết mặc định, có thể truyền vào
  className,
  text,
}) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <a
      href={href}
      className={`custom-button hover:text-[${hoverTextColor}]} ${className}`}
      style={{
        color: isHovered ? hoverTextColor : textColor,
        border: borderColor ? `2px solid ${borderColor}` : "none",
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Div đầu tiên là nền mặc định */}
      <div
        className="button-background-default"
        style={{ backgroundColor: defaultColor }}
      ></div>

      {/* Div thứ hai để tạo hiệu ứng chuyển động khi hover */}
      <div
        className="button-background-hover"
        style={{
          background: `linear-gradient(to right, ${gradientFrom}, ${gradientTo})`,
        }}
      ></div>

      {/* Văn bản "Đặt vé" */}
      <span className="button-text">{text}</span>
    </a>
  );
};

export default CustomButton;

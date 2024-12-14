import React from "react";
import { useLocation, Link } from "react-router-dom";

const Sidebar = ({ userName, menuItems }) => {
  const location = useLocation();

  return (
    <div className="w-fit bg-blue-600 text-white rounded-lg p-4">
      {/* Thông tin người dùng */}
      <div className="flex items-center mb-3">
        <div className="w-6 h-6  rounded-full flex items-center justify-center">
          <img
            src="/Images/account icon.svg" // Đường dẫn ảnh mặc định
            alt="User Avatar"
            className=""
          />
        </div>
        <p className="ml-4 font-medium">{userName}</p>
      </div>

      {/* Danh sách menu */}
      <ul className="space-y-2 ml-4">
        {menuItems.map((item, index) => (
          <li
            key={index}
            className={
              "flex items-center space-x-4 p-2 rounded hover:bg-blue-500"
            }
          >
            <img
              src={
                location.pathname === item.link
                  ? item.activeImage // Hình ảnh khi được chọn
                  : item.defaultImage // Hình ảnh mặc định
              }
              alt={item.label}
              className={"w-6 h-6 object-contain"}
            />
            <Link
              to={item.link}
              className={`${
                location.pathname === item.link
                  ? "text-yellow-300"
                  : "text-white hover:underline"
              }`}
            >
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Sidebar;

import React from "react";
import { useState, useEffect } from "react";
import { FiSearch, FiBell, FiUser } from "react-icons/fi";
const Navbar = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    // Cập nhật giờ mỗi giây
    const interval = setInterval(() => {
      setTime(new Date());
    }, 1000);

    // Dọn dẹp interval khi component bị hủy
    return () => clearInterval(interval);
  }, []);

  const formatDateTime = (date) => {
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    const seconds = date.getSeconds().toString().padStart(2, "0");
    return `${day}/${month}/${year} - Giờ hiện tại: ${hours}:${minutes}:${seconds}`;
  };

  return (
    <div className="flex items-center justify-between mb-6 bg-white rounded-lg shadow-sm p-3">
      <div className="flex items-center w-2/3">
        <p>Xin chào Nguyễn Anh Quyền. Hôm nay là: {formatDateTime(time)}</p>
        {/* <input
          type="text"
          placeholder="Search..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full px-4 py-2 rounded-lg focus:outline-none border"
        />
        <button className="ml-2 text-gray-600 hover:text-gray-800">
          <FiSearch className="w-5 h-5" />
        </button> */}
      </div>
      <div className="flex items-center space-x-4">
        <button className="p-2 text-gray-600 hover:text-gray-800">
          <FiUser className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
};

export default Navbar;

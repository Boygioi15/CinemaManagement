import React from "react";
import { useState, useEffect } from "react";
import { FiSearch, FiBell, FiUser } from "react-icons/fi";
import { useNavigate } from "react-router";
import { useAuth } from "../contexts/AuthContext";
const Navbar = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [time, setTime] = useState(new Date());
  const navigate = useNavigate();
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
  const token = localStorage.getItem("access_token")
  const {signOut,employeeDetail} = useAuth();
  return (
    <div style={{padding:" 5px 50px"}}className="flex items-center justify-between mb-6 bg-white rounded-lg shadow-sm p-3">
      <div className="flex items-center w-2/3">
        <p>Xin chào {employeeDetail && employeeDetail.name}. Hôm nay là: {formatDateTime(time)}</p>
      </div>
      <div className="flex items-center space-x-4">
        <div className="sc_dropdown">
            {token && <div className="Login_Dropdown">
            <label onClick={()=>{
              signOut() 
              navigate('/admin/auth')
              }} 
              className="abc_label">Đăng xuất</label>
          </div>}
          <button onClick={()=>navigate('/admin/auth')}className="p-2 text-gray-600 hover:text-gray-800">
            <FiUser className="w-6 h-6" />
          </button>
        </div>
        
        
      </div>
    </div>
  );
};

export default Navbar;

import React, { useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../Context/AuthContext";
import { callSignOut } from "../config/api";
import { toast } from "react-toastify";

import { LuCalendar,LuPopcorn  } from "react-icons/lu";
import { FaRegUserCircle } from "react-icons/fa";
import { IoMdHelpCircleOutline } from "react-icons/io";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false); // Trạng thái hiển thị menu
  const [keyWord, setKeyWord] = useState("");

  const { user, setUser, loading } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    const response = await callSignOut();
    if (response.success) {
      localStorage.clear();
      setUser(null);
      toast.success("Đăng xuất thành công");
      navigate("/auth");
    }
  };

  const handleProfile = () => {
    navigate("/user/user-space/infor");
  };

  const timerRef = useRef(null);
  const handleMouseEnter = () => {
    clearTimeout(timerRef.current); // Dừng mọi timeout trước đó
    setIsMenuOpen(true);
  };

  const handleMouseLeave = () => {
    timerRef.current = setTimeout(() => {
      setIsMenuOpen(false);
    }, 200); // Độ trễ 200ms
  };

  const handleOnKeyDown = (e) => {
    if (e.key === "Enter") {
      if (keyWord?.trim() === "") {
        return;
      }
      navigate(`/search?keyword=${keyWord}`);
    }
  };
  return (
    <div style={{position:"fixed",top:"0px",width:"100%",zIndex:"40",display:"flex", height:"70px", padding: "0px 50px", justifyContent:"space-between",background:"#0d1831",  borderBottom: "1px solid #34373c"}}className=" p-2.5 flex items-center justify-between  text-2xl">
        <div  className="flex items-center space-x-6">
          <div style={{gap:"5px"}}className="flex items-center space-x-2">
            <img
              alt="Cinestar Logo"
              height="40"
              src="/Images/logo.svg"
              className="h-12"
            />
            <span className="text-white font-bold">
              <Link style={{fontSize:"32px", marginTop:"5px"}} to={"/"}>Nhóm 22</Link>
            </span>
          </div>
          <div >
            <a
              href="/showtimes"
              className="text-white flex items-center space-x-1 hoverText"
              style={{fontSize:"24px",display:"flex",gap:"5px"}}
            >
              <LuCalendar />
              <span>Lịch chiếu</span>
            </a>
          </div>
          <div>
            <a
              href="/food"
              className="text-white flex items-center space-x-1 hoverText"
              style={{fontSize:"24px",display:"flex",gap:"5px"}}
            >
              <LuPopcorn />
              <span>Đặt bắp nước</span>
            </a>
          </div>
        </div>

        <div className="flex items-center space-x-6">
          <div className="search-bar flex items-center bg-white rounded-full px-2 h-12 ">
            <input
              style={{paddingLeft:"20px"}}
              placeholder="Tìm phim"
              type="text"
              className="flex-grow outline-none text-gray-800 placeholder-gray-400 px-2"
              value={keyWord}
              onChange={(e) => setKeyWord(e.target.value)}
              onKeyDown={handleOnKeyDown}
            />
            <button
              className="bg-transparent border-none flex items-center justify-center p-1"
              onClick={() => handleOnKeyDown({ key: "Enter" })}
            >
              <img alt="search" src="/Images/search.svg" className="h-5 w-5" />
            </button>
          </div>
          <div className="additional-links flex items-center space-x-6 ">
            {user ? (
              <div
                className="relative flex items-center"
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
              >
                <a
                  href="#"
                  className="text-white  flex items-center space-x-1 hoverText"
                >
                  <FaRegUserCircle />
                  <span>{user.name}</span>{" "}
                </a>

                {isMenuOpen && (
                  <div className="absolute top-10 left-100 bg-white text-black p-2 shadow-lg rounded-md w-80">
                    <button
                      className="w-full text-left px-4 py-2 hover:bg-gray-200"
                      onClick={handleProfile}
                    >
                      Thông tin cá nhân
                    </button>
                    <button
                      className="w-full text-left px-4 py-2 hover:bg-gray-200"
                      onClick={handleLogout}
                    >
                      Đăng xuất
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                to="/auth"
                className="text-white flex items-center space-x-1 hoverText"
                style={{fontSize:"24px",display:"flex",gap:"5px"}}
              >
                <FaRegUserCircle/>
                <span>Đăng nhập</span>
              </Link>
            )}
            <a
              href="/rule"
              className="text-white flex items-center space-x-1 hoverText"
              style={{fontSize:"24px",display:"flex",gap:"5px"}}
            >
              <IoMdHelpCircleOutline />
              <span>Điều khoản</span>
            </a>
          </div>
        </div>
      
    </div>
  );
};

export default Header;

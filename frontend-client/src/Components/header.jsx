import React, { useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../Context/AuthContext";
import { callSignOut } from "../config/api";
import { toast } from "react-toastify";
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
      console.log("🚀 ~ handleOnKeyDown ~ keyword:", keyWord);
      navigate(`/search?keyword=${keyWord}`);
    }
  };
  return (
    <div className="bg-blue-900 p-2.5 flex items-center justify-between">
      <div className="flex items-center space-x-6">
        <div className="flex items-center space-x-2">
          <img
            alt="Cinestar Logo"
            height="40"
            src="/Images/logo.svg"
            className="h-8"
          />
          <span className="text-white text-lg font-bold">
            <Link to={"/"}>Nhóm 22</Link>
          </span>
        </div>
        <div>
          <a
            href="#"
            className="text-white text-sm flex items-center space-x-1 hover:underline"
          >
            <img alt="search" src="/Images/calendar.svg" className="h-5 w-5" />
            <span>Lịch chiếu</span>
          </a>
        </div>
      </div>

      <div className="flex items-center space-x-6">
        <div className="search-bar flex items-center bg-white rounded-full px-2 h-10 w-72">
          <input
            placeholder="Tìm phim"
            type="text"
            className="flex-grow outline-none text-xs text-gray-800 placeholder-gray-400 px-2"
            value={keyWord}
            onChange={(e) => setKeyWord(e.target.value)}
            onKeyDown={handleOnKeyDown}
          />
          <button
            className="bg-transparent border-none flex items-center justify-center p-1"
            onClick={() => handleOnKeyDown({ key: "Enter" })}
          >
            <img alt="search" src="/Images/search.svg" className="h-4 w-4" />
          </button>
        </div>
        <div className="additional-links flex items-center space-x-6">
          {user ? (
            <div
              className="relative flex items-center"
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              <a
                href="#"
                className="text-white text-sm flex items-center space-x-1 hover:underline"
              >
                <img
                  alt="user"
                  src="/Images/account icon.svg"
                  className="h-5 w-5"
                />
                <span>{user.name}</span>{" "}
              </a>

              {isMenuOpen && (
                <div className="absolute top-10 right-0 bg-white text-black p-2 shadow-lg rounded-md w-40">
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
              className="text-white text-sm flex items-center space-x-1 hover:underline"
            >
              <img
                alt="user"
                src="/Images/account icon.svg"
                className="h-5 w-5"
              />
              <span>Đăng nhập</span>
            </Link>
          )}
          <a
            href="#"
            className="text-white text-sm flex items-center space-x-1 hover:underline"
          >
            <img alt="help" src="/Images/question.png" className="h-6 w-6" />
            <span>Trợ giúp</span>
          </a>
        </div>
      </div>
    </div>
  );
};

export default Header;

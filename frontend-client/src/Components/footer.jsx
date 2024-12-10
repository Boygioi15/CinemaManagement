import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer
      className=" text-white py-8"
      style={{
        backgroundColor: "#1e3a8a",
      }}
    >
      <div className="container mx-auto flex justify-center gap-10">
        {/* Group 1: Tài khoản */}
        <div className="text-center  border-blue-400 p-4">
          <h3 className="font-bold text-lg mb-2">Tài khoản</h3>
          <ul className="space-y-1">
            <li>
              <Link to="/auth" className="hover:underline ml-7">
                Đăng nhập
              </Link>
            </li>
            <li>
              <Link to="/auth/register" className="hover:underline ml-2">
                Đăng ký
              </Link>
            </li>
          </ul>
        </div>

        {/* Group 2: Xem phim */}
        <div className="text-center border-blue-400 p-4">
          <h3 className="font-bold text-lg mb-2">Xem phim</h3>
          <ul className="space-y-1">
            <li>
              <Link to="/now-showing" className="hover:underline ml-16">
                Phim đang chiếu
              </Link>
            </li>
            <li>
              <a href="/coming-soon" className="hover:underline ml-[52px]">
                Phim sắp chiếu
              </a>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

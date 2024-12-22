import React, { useState } from "react";
import { Link } from "react-router-dom";

function SuccessPage() {
  const [username, setUsername] = useState("");

  return (
    <div
      className="min-h-screen m-0 overflow-y-auto font-sans text-white bg-gradient-to-b from-[#0b0d1c] to-[#1a1a2e]bg-contain"
      style={{
        backgroundColor: "#14102c",
      }}
    >
      <div className=" min-h-screen flex items-center justify-center">
        <div className=" text-white rounded-lg shadow-lg p-6 w-[500px]">
          <h2 className="text-3xl font-bold mb-4 text-center">
            Đặt lại mật khẩu thành công
          </h2>
          <p className="text-center text-base mb-6">
            Mật khẩu đã được đặt lại, vui lòng kiểm tra email và tiến hành đăng
            nhập.
          </p>
          <Link to="/auth">
            <button className="w-full bg-yellow-400 hover:bg-yellow-300 text-black font-medium py-2 rounded-lg transition duration-200">
              Tiến hành đăng nhập
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default SuccessPage;

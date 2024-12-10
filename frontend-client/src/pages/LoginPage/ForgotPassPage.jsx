import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function ForgotPasswordPage() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const handleClick = async (e) => {};

  return (
    <div
      className="min-h-screen m-0 overflow-y-auto font-sans text-white bg-gradient-to-b from-[#0b0d1c] to-[#1a1a2e]bg-contain"
      style={{
        backgroundColor: "#14102c",
      }}
    >
      <div className=" min-h-screen flex items-center justify-center">
        <div className=" text-white rounded-lg shadow-lg p-6 w-96">
          <h2 className="text-3xl font-bold mb-4 text-center">Quên mật khẩu</h2>
          <p className="text-center text-sm mb-6">
            Nhập địa chỉ email của bạn và chúng tôi sẽ gửi cho bạn hướng dẫn để
            tạo mật khẩu mới
          </p>
          <input
            type="text"
            placeholder="Nhập tài khoản"
            className="w-full p-3 text-black rounded-lg mb-4 outline-none border border-gray-300 focus:ring-2 focus:ring-indigo-400"
          />
          <button className="w-full bg-yellow-400 hover:bg-yellow-300 text-black font-medium py-2 rounded-lg transition duration-200">
            Gửi mã xác minh
          </button>
        </div>
      </div>
    </div>
  );
}

export default ForgotPasswordPage;

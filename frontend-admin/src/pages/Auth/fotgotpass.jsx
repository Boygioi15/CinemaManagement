import React, { useState } from "react";
import { FaEnvelope } from "react-icons/fa";
import { Link } from "react-router-dom";

const ForgotPasswordPage = () => {
  const [resetEmail, setResetEmail] = useState("");

  const handleResetPassword = (e) => {
    e.preventDefault();
    if (!resetEmail.trim()) {
      alert("Please enter your email");
      return;
    }
    alert(`Password reset link will be sent to ${resetEmail}`);
    setResetEmail("");
  };

  return (
    <div style={{backgroundColor:"rgb(245,245,245)"}} className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-6 bg-white p-10 rounded-xl shadow-2xl">
        <div>
          <h2 className="text-center text-3xl font-extrabold text-gray-900 mb-4">
            Đặt lại mật khẩu
          </h2>
        </div>
        <span className="text-base">
          Hãy nhập email và chúng tôi sẽ gửi cho bạn link để đặt lại mật khẩu
        </span>
        <form className=" space-y-4" onSubmit={handleResetPassword}>
          <div className="relative">
            <FaEnvelope className="absolute top-3 left-3 text-gray-400" />
            <input
              type="email"
              value={resetEmail}
              onChange={(e) => setResetEmail(e.target.value)}
              className="appearance-none rounded-md relative block w-full px-10 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
              placeholder="Nhập email..."
            />
          </div>
          <div className="flex space-x-4">
            <button
              type="submit"
              className="flex-1 justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Gửi link
            </button>
            <Link
              to="/admin/auth"
              className="flex-1 justify-center py-2 px-4 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 text-center"
            >
              Trở lại đăng nhập
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;

import React from "react";
import { Link } from "react-router-dom";

const NotFoundPage = (error) => {
  if(error){
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900 p-4">
        <div className="text-center">
          <h1 className="text-6xl font-bold text-red-500 mb-4">Có lỗi không mong muốn xảy ra!</h1>
          <div className="space-y-4">
            <h2 className="text-3xl font-semibold text-white mb-2">
              {error}
            </h2>
            <p className="text-gray-300 text-lg max-w-md mx-auto">
              Hãy liên hệ với 0373865627 Ta trở lại nhé!
            </p>
            <Link
              to="/"
              className="inline-block px-6 py-3 mt-6 text-lg font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition duration-300 ease-in-out transform hover:scale-105"
            >
              Quay lại trang chủ
            </Link>
            <div className="mt-8">
              <div className="w-16 h-1 bg-red-600 mx-auto rounded-full"></div>
              <div className="w-12 h-1 bg-red-600 mx-auto rounded-full mt-2"></div>
              <div className="w-8 h-1 bg-red-600 mx-auto rounded-full mt-2"></div>
            </div>
          </div>
        </div>
      </div>
  }
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 p-4">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-red-500 mb-4">404</h1>
        <div className="space-y-4">
          <h2 className="text-3xl font-semibold text-white mb-2">
            Oops! Không tìm thấy đường dẫn
          </h2>
          <p className="text-gray-300 text-lg max-w-md mx-auto">
            Nhìn như đường dẫn mà bạn muốn truy cập không tồn tại. Ta trở lại nhé!
          </p>
          <Link
            to="/"
            className="inline-block px-6 py-3 mt-6 text-lg font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition duration-300 ease-in-out transform hover:scale-105"
          >
            Quay lại trang chủ
          </Link>
          <div className="mt-8">
            <div className="w-16 h-1 bg-red-600 mx-auto rounded-full"></div>
            <div className="w-12 h-1 bg-red-600 mx-auto rounded-full mt-2"></div>
            <div className="w-8 h-1 bg-red-600 mx-auto rounded-full mt-2"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;

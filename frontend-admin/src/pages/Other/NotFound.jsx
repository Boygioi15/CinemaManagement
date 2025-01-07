import React from "react";
import { SearchX, Home, PhoneCall } from "lucide-react";

const NotFound = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 flex items-center justify-center p-4">
      <div className="max-w-lg w-full bg-white rounded-xl shadow-lg p-8 text-center">
        {/* Icon Section */}
        <div className="relative mb-8">
          <div className="flex justify-center">
            <SearchX className="h-24 w-24 text-gray-400" />
          </div>
          <h1 className="text-8xl font-bold text-gray-300 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            404
          </h1>
        </div>

        <h2 className="text-3xl font-bold text-gray-800 mb-4">
          Không Tìm Thấy Trang
        </h2>

        <div className="space-y-4 mb-8">
          <p className="text-gray-600">
            Xin lỗi, trang bạn đang tìm kiếm không tồn tại hoặc đã được di
            chuyển.
          </p>
          <p className="text-gray-500 text-sm">
            Đường dẫn không chính xác. Vui lòng
            kiểm tra lại đường dẫn hoặc quay về trang chủ để tiếp tục.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <button
            onClick={() => (window.location.href = "/")}
            className="flex items-center justify-center space-x-2 bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200"
          >
            <Home className="h-5 w-5" />
            <span>Về Trang Chủ</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;

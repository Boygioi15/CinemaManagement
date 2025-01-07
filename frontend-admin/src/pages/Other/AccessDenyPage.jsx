import React from "react";
import { AlertCircle } from "lucide-react";

const AccessDenied = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
        <div className="flex justify-center mb-6">
          <AlertCircle className="h-16 w-16 text-red-500" />
        </div>

        <h1 className="text-6xl font-bold text-red-500 mb-4">403</h1>

        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
          Không có quyền truy cập
        </h2>

        <p className="text-gray-600 mb-8">
          Xin lỗi, bạn không có quyền truy cập trang này. Vui lòng liên hệ với
          quản trị viên nếu bạn cho rằng đây là một lỗi.
        </p>

        <div className="flex justify-center">
          <button
            onClick={() => (window.location.href = "/admin/auth")}
            className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-6 rounded-md transition-colors duration-200"
          >
            Quay lại
          </button>
        </div>
      </div>
    </div>
  );
};

export default AccessDenied;

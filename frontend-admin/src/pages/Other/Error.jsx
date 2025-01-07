import React from "react";
import { AlertCircle } from "lucide-react";
import { useRouteError } from "react-router";

const Error = () => {
  const error = useRouteError();
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
        <div className="flex justify-center mb-6">
          <AlertCircle className="h-16 w-16 text-red-500" />
        </div>

        <h1 className="text-3xl font-bold text-red-500 mb-4">
          Có lỗi bất ngờ xảy ra
        </h1>

        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
          Lỗi: {error?.toString()}
        </h2>
        <p className="text-gray-600 mb-8">
          Vui lòng chụp lại màn hình và liên hệ với 0373865627 để được hỗ trợ
        </p>

        <div className="flex justify-center">
          <button
            onClick={() => (window.location.href = "/")}
            className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-6 rounded-md transition-colors duration-200"
          >
            Quay về trang chủ
          </button>
        </div>
      </div>
    </div>
  );
};

export default Error;

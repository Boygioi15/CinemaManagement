import React from "react";

const LoadingSpinner = () => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-5 rounded-lg flex flex-col items-center space-y-3">
        <div className="w-12 h-12 border-4 border-blue-900 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-blue-900 font-medium">Đang tải...</p>
      </div>
    </div>
  );
};

export default LoadingSpinner;

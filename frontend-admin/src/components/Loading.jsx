import { useState, useEffect } from "react";
import { BiRefresh } from "react-icons/bi";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

const RefreshLoader = ({ isOpen }) => {
  if (!isOpen) return null;

  return (
    <div className="relative min-h-screen flex items-center justify-center">
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white p-8 rounded-lg shadow-xl flex flex-col items-center">
          <AiOutlineLoading3Quarters className="text-4xl text-blue-500 animate-spin" />
          <p className="mt-4 text-gray-700 font-medium">Loading...</p>
        </div>
      </div>
    </div>
  );
};

export default RefreshLoader;

import React, { useState } from "react";
import { ChevronDown } from "lucide-react";

const QuickBooking = () => {
  const [selectedCinema, setSelectedCinema] = useState("");
  const [selectedMovie, setSelectedMovie] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedShowtime, setSelectedShowtime] = useState("");

  return (
    <div className="bg-white rounded-lg shadow-lg p-4 flex items-center gap-3">
      <div className="font-bold text-xl text-gray-800 whitespace-nowrap">
        ĐẶT VÉ NHANH
      </div>

      <div className="relative flex-1">
        <button
          className="w-full bg-yellow-300 hover:bg-yellow-400 px-4 py-3 rounded-lg text-left flex items-center justify-between"
          onClick={() => {}}
        >
          <span>{selectedCinema || "Cinestar Sinh Viên"}</span>
          <ChevronDown className="w-5 h-5" />
        </button>
      </div>

      <div className="relative flex-1">
        <button
          className="w-full bg-white border-2 border-purple-600 hover:bg-gray-50 px-4 py-3 rounded-lg text-left flex items-center justify-between"
          onClick={() => {}}
        >
          <span className="text-purple-600">2. Chọn Phim</span>
          <ChevronDown className="w-5 h-5 text-purple-600" />
        </button>
      </div>

      <div className="relative flex-1">
        <button
          className="w-full bg-white border-2 border-purple-600 hover:bg-gray-50 px-4 py-3 rounded-lg text-left flex items-center justify-between"
          onClick={() => {}}
        >
          <span className="text-purple-600">3. Chọn Ngày</span>
          <ChevronDown className="w-5 h-5 text-purple-600" />
        </button>
      </div>
      <div className="relative flex-1">
        <button
          className="w-full bg-white border-2 border-purple-600 hover:bg-gray-50 px-4 py-3 rounded-lg text-left flex items-center justify-between"
          onClick={() => {}}
        >
          <span className="text-purple-600">4. Chọn Suất</span>
          <ChevronDown className="w-5 h-5 text-purple-600" />
        </button>
      </div>

      <button
        className="bg-purple-700 hover:bg-purple-800 text-white px-6 py-3 rounded-lg font-medium whitespace-nowrap transition-colors"
        onClick={() => {}}
      >
        ĐẶT NGAY
      </button>
    </div>
  );
};

export default QuickBooking;

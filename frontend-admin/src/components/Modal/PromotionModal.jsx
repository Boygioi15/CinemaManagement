import axios from "axios";
import { create } from "lodash";
import React from "react";
import { useState } from "react";
import { createPromotion } from "../../../../frontend-client/src/config/api";

const convertToISOWithLocalTime = (dateString) => {
  const date = new Date(dateString);
  const isoString = new Date(
    date.getTime() - date.getTimezoneOffset() * 60000
  ).toISOString();
  return isoString;
};

const convertToLocalDateTime = (isoString) => {
  const date = new Date(isoString);
  return date.toISOString().slice(0, 16);
};

const PromotionModal = () => {
  const [formData, setFormData] = useState({
    name: "",
    beginDate: "",
    endDate: "",
    discountRate: "",
  });
  const handleSubmit = async () => {
    // Hàm chuyển đổi sang múi giờ Việt Nam (GMT+7)
    const toVietnamTime = (date) => {
      const vnOffset = 7 * 60; // 7 giờ x 60 phút
      const localDate = new Date(date);
      localDate.setMinutes(localDate.getMinutes() + vnOffset); // Cộng thêm offset
      return localDate.toISOString(); // Trả về ISO string
    };

    // Định dạng ngày về múi giờ Việt Nam
    const formattedStart = toVietnamTime(formData.beginDate);
    formData.beginDate = formattedStart;
    const formattedEnd = toVietnamTime(formData.endDate);
    formData.endDate = formattedEnd;

    console.log(formData);

    // Gửi dữ liệu lên server
    const response = await axios.post(
      "http://localhost:8000/api/promotion",
      formData
    );
    console.log(response);
  };

  const handleStartTimeChange = (value) => {
    // Chuyển đổi thời gian sang định dạng ISO với múi giờ địa phương và lưu vào flashSaleData
    const isoStartTime = convertToISOWithLocalTime(value);

    setFormData((prev) => ({ ...prev, start: value.split("T")[0] }));
  };

  const handleEndTimeChange = (value) => {
    // Chuyển đổi thời gian sang định dạng ISO với múi giờ địa phương và lưu vào flashSaleData
    const isoEndTime = convertToISOWithLocalTime(value);
    const newFlashSaleData = { ...flashSaleData, endTime: isoEndTime };
    setFlashSaleData(newFlashSaleData);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <h2 className="text-lg font-bold mb-4">Thông tin cơ bản</h2>
      <div className="mb-6"></div>
      <div className="grid grid-cols-2 gap-6">
        <div>
          <label className="text-sm font-medium text-gray-700 block mb-2">
            Khung thời gian bắt đầu
          </label>
          <input
            type="datetime-local"
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-mainColor"
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, beginDate: e.target.value }))
            }
            value={formData.beginDate}
          />
        </div>
        <div>
          <label className="text-sm font-medium text-gray-700 block mb-2">
            Khung thời gian kết thúc
          </label>
          <input
            type="datetime-local"
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-mainColor"
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, endDate: e.target.value }))
            }
            value={formData.endDate}
          />
        </div>
        <div>
          <label className="text-sm font-medium text-gray-700 block mb-2">
            Khuyến mãi (%)
          </label>
          <input
            type="number"
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-mainColor"
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, discountRate: e.target.value }))
            }
            value={formData.discountRate}
          />
        </div>
        <div>
          <label className="text-sm font-medium text-gray-700 block mb-2">
            Tên sự kiện
          </label>
          <input
            type="text"
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-mainColor"
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, name: e.target.value }))
            }
            value={formData.name}
          />
        </div>
      </div>
      <button
        onClick={() => {
          handleSubmit();
        }}
        className={`px-4 py-2 rounded-lg  ${"bg-blue-500 hover:bg-blue-700"} text-white`}
      >
        Thêm
      </button>
      {/* Tích hợp ThumbnailUpload */}
    </div>
  );
};

export default PromotionModal;

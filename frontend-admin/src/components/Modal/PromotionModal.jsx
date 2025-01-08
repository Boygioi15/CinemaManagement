import React from "react";
import { FiX } from "react-icons/fi";
import { useState, useEffect, useMemo } from "react";
import axios from "axios";
import SuccessDialog from "../Dialog/SuccessDialog";
import Dialog from "../Dialog/ConfirmDialog";
import RefreshLoader from "../Loading";

const PromotionModal = ({ isOpen, onClose, promotion, onSave, mode }) => {
  if (!isOpen) return null;
  const isEditMode = mode === "edit";
  const title = isEditMode ? "Cập nhật thông tin sự kiện" : "Thêm mới sự kiện";
  console.log(promotion);

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toISOString().split("T")[0]; // Trả về định dạng YYYY-MM-DD
  };

  const [formData, setFormData] = useState({
    _id: promotion?._id || "",
    name: promotion?.name || "",
    discountRate: promotion?.discountRate,
    beginDate: formatDate(promotion?.beginDate) || "",
    endDate: formatDate(promotion?.endDate) || "",
    thumbnailURL: promotion?.thumbnailURL || "",
    thumbnailFile: null,
    file: null,
  });

  const isFormValid = useMemo(() => {
    const requiredFields = [
      "name",
      "discountRate",
      "beginDate",
      "endDate",
    ];

    return (
      requiredFields.every((field) => !!formData[field]) &&
      (formData.thumbnailFile || formData.thumbnailURL)
    ); // Chuyển đổi giá trị thành Boolean
  }, [formData]);

  const handleSubmit = () => {
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">{title}</h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <FiX className="w-6 h-6" />
            </button>
          </div>

          <div className="flex gap-6">
            <div className="flex-1 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tên sự kiện
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, name: e.target.value }))
                  }
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Khuyến mãi (%)
                </label>
                <input
                  type="text"
                  name="discountRate"
                  value={formData.discountRate}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      discountRate: e.target.value,
                    }))
                  }
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Ngày bắt đầu
                </label>
                <input
                  type="date"
                  name="beginDate"
                  value={formData.beginDate}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      beginDate: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Ngày kết thúc
                </label>
                <input
                  type="date"
                  name="endDate"
                  value={formData.endDate}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      endDate: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            <div className="w-1/3">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Ảnh
              </label>
              {(formData.thumbnailFile || formData.thumbnailURL) && (
                <img
                  src={
                    formData.thumbnailFile
                      ? URL.createObjectURL(formData.thumbnailFile)
                      : formData.thumbnailURL
                  }
                  alt="Film"
                  className="w-full h-4/5 object-cover rounded-lg mb-2"
                />
              )}
              <input
                type="file"
                className="w-full"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files[0];
                  if (file) {
                    // Tạo URL tạm thời từ file và cập nhật formData.image
                    setFormData((prev) => ({
                      ...prev,
                      file: file,
                      thumbnailFile: file,
                    }));
                  }
                  console.log("File selected:", e.target.files[0]);
                }}
              />
            </div>
          </div>
          <div className="flex justify-end space-x-4 mt-6">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200"
            >
              Hủy
            </button>
            <button
              onClick={handleSubmit}
              disabled={!isFormValid}
              className={`px-4 py-2 rounded-lg  ${
                isFormValid
                  ? "bg-blue-500 hover:bg-blue-700"
                  : "bg-gray-400 cursor-not-allowed"
              } text-white`}
            >
              {isEditMode ? "Lưu thay đổi" : "Thêm mới"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PromotionModal;

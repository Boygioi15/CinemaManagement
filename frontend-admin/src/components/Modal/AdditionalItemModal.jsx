import React from "react";
import { FiX } from "react-icons/fi";
import { useState, useEffect, useMemo } from "react";

const AdditionalItemModal = ({ isOpen, onClose, item, onSave, mode }) => {
  if (!isOpen) return null;

  const isEditMode = mode === "edit";
  const title = isEditMode ? "Cập nhật sản phẩm" : "Thêm mới sản phẩm";

  // Initialize state with existing film data or empty values
  const [formData, setFormData] = useState({
    _id: item?._id || "",
    name: item?.name || "",
    price: item?.price || "",
    loyalPointRate: item?.loyalPointRate || "",
    thumbnailURL: item?.thumbnailURL || "",
    file: null,
  });

  const isFormValid = useMemo(() => {
    const requiredFields = ["name", "price", "thumbnailURL", "loyalPointRate"];
    console.log(formData);

    return requiredFields.every((field) => !!formData[field]); // Chuyển đổi giá trị thành Boolean
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
                  Tên Sản phẩm
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
                  Giá
                </label>
                <input
                  type="text"
                  name="price"
                  value={formData.price}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, price: e.target.value }))
                  }
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Điểm tích lũy (%)
                </label>
                <input
                  type="number"
                  name="loyalPointRate"
                  value={formData.loyalPointRate}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      loyalPointRate: e.target.value,
                    }))
                  }
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            <div className="w-1/3">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Ảnh
              </label>
              {formData.thumbnailURL && (
                <img
                  src={formData.thumbnailURL}
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
                    const imageUrl = URL.createObjectURL(file);
                    setFormData((prev) => ({
                      ...prev,
                      file: file,
                      thumbnailURL: imageUrl,
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

export default AdditionalItemModal;

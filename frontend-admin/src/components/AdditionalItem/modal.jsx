import React from "react";
import { FiX } from "react-icons/fi";
import { useState, useEffect, useMemo } from "react";
import axios from "axios";
import Dialog from "../Film/ConfirmDialog";
import SuccessDialog from "../Film/SuccessDialog";

const ItemModal = ({ isOpen, onClose, item, onSave, mode }) => {
  if (!isOpen) return null;

  const isEditMode = mode === "edit";
  const title = isEditMode ? "Edit Item Details" : "Add New Item";

  const [query, setQuery] = useState("");
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
  const [isSuccessDialogOpen, setIsSuccessDialogOpen] = useState(false);
  const [dialogData, setDialogData] = useState({ title: "", message: "" });
  const [data, setData] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Initialize state with existing film data or empty values
  const [formData, setFormData] = useState({
    _id: item?._id || "",
    name: item?.name || "",
    description: item?.description || "",
    price: item?.price || "",
    inStorage: item?.inStorage || "",
    thumbnailURL: item?.thumbnailURL || "",
  });

  const isFormValid = useMemo(() => {
    const requiredFields = [
      "name",
      "description",
      "price",
      "inStorage",
      "thumbnailURL",
    ];
    console.log(formData);

    return requiredFields.every((field) => !!formData[field]); // Chuyển đổi giá trị thành Boolean
  }, [formData]);

  const handleSubmit = () => {
    onSave(formData);
    setIsConfirmDialogOpen(true);
    if (mode === "edit") {
      setDialogData({
        title: "Confirm update",
        message: "Bạn có chắc chắn là cập nhật phim này không ?",
      });
    } else {
      setDialogData({
        title: "Confirm add",
        message: "Bạn có chắc chắn là thêm phim này không ?",
      });
    }
  };

  const handleFilm = async () => {
    // setIsLoading(true);
    // try {
    //   console.log(`data nè heheh:${data.otherDescription} `);
    //   // Gọi API tùy thuộc vào mode
    //   if (mode === "edit") {
    //     await axios.put(`http://localhost:8000/api/films/${data.id}`, data);
    //     setDialogData({
    //       title: "Successs",
    //       message: "Cập nhật phim thành công",
    //     });
    //   } else {
    //     await axios.post("http://localhost:8000/api/films", data);
    //     setDialogData({
    //       title: "Successs",
    //       message: "Thêm phim thành công",
    //     });
    //   }
    //   if (response.status === 200 || response.status === 201) {
    //     // Cập nhật state và hiển thị success dialog
    //     // Sau khi thành công, hiển thị dialog success
    //     setIsLoading(false); // Tắt trạng thái loading
    //     setIsConfirmDialogOpen(false); // Đóng dialog xác nhận
    //     setIsSuccessDialogOpen(true); // Hiển thị dialog thành công
    //   }
    // } catch (error) {
    //   console.error("Error updating/adding film:", error);
    //   alert("An error occurred while updating the film. Please try again.");
    //   setIsLoading(false); // Tắt trạng thái loading
    // }
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
                  Mô tả
                </label>
                <input
                  type="text"
                  name="country"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      originatedCountry: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Số lượng kho
                </label>
                <input
                  type="text"
                  name="duration"
                  value={formData.inStorage}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      filmDuration: e.target.value,
                    }))
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
                  name="voice"
                  value={formData.price}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, voice: e.target.value }))
                  }
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            <div className="w-1/3">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Item Image
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
              Cancel
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
              {isEditMode ? "Save Changes" : "Add Film"}
            </button>
          </div>
        </div>
      </div>

      {/* <Dialog
        isOpen={isConfirmDialogOpen}
        onClose={() => setIsConfirmDialogOpen(false)}
        onConfirm={handleFilm}
        title={dialogData.title}
        message={dialogData.message}
        data={data}
        mode={mode}
      />
      <SuccessDialog
        isOpen={isSuccessDialogOpen}
        onClose={() => setIsSuccessDialogOpen(false)}
        title={dialogData.title}
        message={dialogData.message}
      /> */}
    </div>
  );
};

export default ItemModal;

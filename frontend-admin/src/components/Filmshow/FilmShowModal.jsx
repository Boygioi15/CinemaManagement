import React from "react";
import { FiX } from "react-icons/fi";
import { useState, useEffect, useMemo } from "react";
import axios from "axios";
import Dialog from "../Film/ConfirmDialog";
import SuccessDialog from "../Film/SuccessDialog";

const FilmShowModal = ({ isOpen, onClose, item, onSave, mode }) => {
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
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">
              Edit Film Details
            </h2>
            <button
              onClick={handleCloseModal}
              className="text-gray-500 hover:text-gray-700"
            >
              <FiX className="w-6 h-6" />
            </button>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Film Name
                </label>
                <input
                  type="text"
                  value={selectedFilm.name}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Film Name
                </label>
                <input
                  type="text"
                  value={selectedFilm.name}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Film Name
                </label>
                <input
                  type="text"
                  value={selectedFilm.name}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Film Name
                </label>
                <input
                  type="text"
                  value={selectedFilm.name}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mt-1 mb-1">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    filmDescription: e.target.value,
                  }))
                }
                rows="4"
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              ></textarea>
            </div>

            <div className="flex justify-end space-x-4 mt-6">
              <button
                onClick={handleCloseModal}
                className="px-4 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200"
              >
                Cancel
              </button>
              <button className="px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700">
                Save Changes
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FilmShowModal;

import React from "react";
import { FiX } from "react-icons/fi";
import { useState, useEffect, useMemo } from "react";
import axios from "axios";
import SuccessDialog from "../../components/SuccessDialog";
import Dialog from "../../components/ConfirmDialog";
import RefreshLoader from "../Loading";

const EmployeeModal = ({ isOpen, onClose, employee, onSave, mode }) => {
  if (!isOpen) return null;
  const isEditMode = mode === "edit";
  const title = isEditMode
    ? "Cập nhật thông tin nhân viên"
    : "Thêm mới nhân viên";

  const [phoneError, setPhoneError] = useState(""); // Trạng thái lỗi email
  const [emailError, setEmailError] = useState(""); // Trạng thái lỗi email

  const [error, setError] = useState("");

  const formatTime = (time) => {
    if (
      !time ||
      typeof time.hour === "undefined" ||
      typeof time.minute === "undefined"
    ) {
      return "";
    }

    // Đảm bảo giờ và phút luôn có 2 chữ số
    const hours = String(time.hour).padStart(2, "0"); // Thêm số 0 ở đầu nếu cần
    const minutes = String(time.minute).padStart(2, "0");
    return `${hours}:${minutes}`;
  };

  const [formData, setFormData] = useState({
    name: employee?.name || "",
    birthDate: employee?.birthDate.split("T")[0] || "",
    email: employee?.email,
    phone: employee?.phone || [],
    blocked: employee?.blocked || "",
    jobTitle: employee?.jobTitle || "",
    salary: employee?.salary || "",
    shiftStart: formatTime(employee?.shiftStart) || "",
    shiftEnd: formatTime(employee?.shiftEnd) || "",
  });

  const isFormValid = useMemo(() => {
    const requiredFields = [
      "name",
      "birthDate",
      "email",
      "phone",
      "jobTitle",
      "salary",
      "shiftStart",
      "shiftEnd",
    ];

    return requiredFields.every((field) => !!formData[field]);
  }, [formData]);

  const handleSubmit = () => {
    const updatedFormData = {
      ...formData,
      shiftStart: convertToObject(formData.shiftStart),
      shiftEnd: convertToObject(formData.shiftEnd),
    };
    onSave(updatedFormData);
  };
  const convertToObject = (value) => {
    const [hour, minute] = value.split(":").map(Number);
    return { hour, minute };
  };

  const validateShifts = () => {
    const [startHour, startMinute] = formData.shiftStart.split(":").map(Number);
    const [endHour, endMinute] = formData.shiftEnd.split(":").map(Number);

    const startTotalMinutes = startHour * 60 + startMinute; // Quy đổi phút
    const endTotalMinutes = endHour * 60 + endMinute;

    if (startTotalMinutes >= endTotalMinutes) {
      setError("Ca bắt đầu không thể sau hoặc trùng với ca kết thúc!");
    } else {
      setError(""); // Xóa lỗi nếu hợp lệ
    }
  };

  const handleEmailChange = (e) => {
    const email = e.target.value;

    // Cập nhật giá trị email
    setFormData((prev) => ({ ...prev, email }));

    // Kiểm tra định dạng email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setEmailError("Email không hợp lệ"); // Gán lỗi
    } else {
      setEmailError(""); // Xóa lỗi nếu email hợp lệ
    }
  };

  const handlePhoneChange = (e) => {
    const phone = e.target.value;
    setFormData((prev) => ({ ...prev, phone }));

    const phoneRegex = /^0\d{9}$/;
    if (!phoneRegex.test(phone)) {
      setPhoneError("Số điện thoại không hợp lệ"); // Gán lỗi
    } else {
      setPhoneError(""); // Xóa lỗi nếu email hợp lệ
    }
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

          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tên nhân viên
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
                Ngày sinh
              </label>
              <input
                type="date"
                name="birthDate"
                value={formData.birthDate}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    birthDate: e.target.value,
                  })
                }
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="text"
                name="email"
                value={formData.email}
                onChange={handleEmailChange}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {emailError && (
                <p className="text-red-500 text-sm mt-1">{emailError}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Số điện thoại
              </label>
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handlePhoneChange}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {phoneError && (
                <p className="text-red-500 text-sm mt-1">{phoneError}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Công việc
              </label>
              <input
                type="text"
                name="jobTitle"
                value={formData.jobTitle}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, jobTitle: e.target.value }))
                }
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Lương
              </label>
              <input
                type="text"
                name="salary"
                value={formData.salary}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, salary: e.target.value }))
                }
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Ca bắt đầu
              </label>
              <input
                type="time"
                name="shiftStart"
                value={formData.shiftStart}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    shiftStart: e.target.value,
                  }))
                }
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Ca kết thúc
              </label>
              <input
                type="time"
                name="shiftEnd"
                value={formData.shiftEnd}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    shiftEnd: e.target.value,
                  }))
                }
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <div className="flex justify-end space-x-4 mt-6">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200"
            >
              Hủy bỏ
            </button>
            <button
              onClick={() => {
                validateShifts();
                handleSubmit();
              }}
              disabled={!isFormValid}
              className={`px-4 py-2 rounded-lg  ${
                isFormValid
                  ? "bg-blue-500 hover:bg-blue-700"
                  : "bg-gray-400 cursor-not-allowed"
              } text-white`}
            >
              {isEditMode ? "Lưu thay đổi" : "Thêm nhân viên"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeModal;

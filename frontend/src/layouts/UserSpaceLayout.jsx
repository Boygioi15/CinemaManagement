import React from "react";
import AuthForm from "../Components/AuthForm";
import { useLocation } from "react-router-dom";
import { useState, useEffect } from "react";

const UserInfoPage = () => {
  const handleSave = (e) => {};
  const { state } = useLocation(); // Lấy thông tin từ state
  const [fields, setFields] = useState([]);
  const convertDateToISO = (date) => {
    const [day, month, year] = date.split("/"); // Nếu date có định dạng DD/MM/YYYY
    return `${year}-${month}-${day}`; // Chuyển sang YYYY-MM-DD
  };

  useEffect(() => {
    const updateFields = () => {
      const userInfo = state?.userInfo || {};
      console.log(userInfo);

      const updatedFields = [
        {
          for: "fullname",
          text: "Họ và tên",
          type: "text",
          value: userInfo.fullname || "",
          required: true,
        },
        {
          for: "dob",
          text: "Ngày sinh",
          type: "date",
          value: convertDateToISO(userInfo.dob) || "",
          required: true,
        },
        {
          for: "email",
          text: "Email",
          type: "email",
          value: userInfo.email || "",
          required: true,
        },
        {
          for: "SDT",
          text: "Số điện thoại",
          type: "text",
          value: userInfo.sdt || "",
          required: true,
        },
      ];

      console.log("updated fields: ", updatedFields); // Kiểm tra kết quả
      setFields(updatedFields);
    };
    updateFields();
  }, [state]);
  console.log("fields: ", fields);

  return (
    <div className="h-screen bg-gradient-to-br from-[#0f0e2e] to-[#2a2476] ">
      <div className="flex items-center justify-center ml-40 pt-28">
        {/* Sidebar */}
        <div className="w-1/5 bg-gradient-to-r from-purple-700 to-blue-600 p-6 rounded-lg  mb-28">
          <div className=" mb-4">
            <p className="font-bold text-lg">Hoàng Tiến Đạt</p>
          </div>
          <div>
            <div className="py-2 px-4 font-bold text-yellow-400 bg-blue-800 rounded-lg cursor-pointer">
              Thông tin người dùng
            </div>
            <div className="py-2 px-4 mt-4 cursor-pointer  rounded-lg">
              Lịch sử
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="w-4/5 text-black">
          <div className=" p-6 rounded-lg ">
            <AuthForm
              title="Thông tin khách hàng"
              layout="row"
              fields={fields}
              buttontitle="Lưu thông tin"
              onSubmit={handleSave}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserInfoPage;

import React from "react";
import { useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import UserChangePassComponent from "../../Components/UserChangePassComponent";
import UserInfoLayout from "../../layouts/UserSpaceLayout";
const UserChangePass = () => {
  const handleSave = (e) => {};
  const { state } = useLocation(); // Lấy thông tin từ state
  const [fields, setFields] = useState([]);
  // const convertDateToISO = (date) => {
  //   const [day, month, year] = date.split("/"); // Nếu date có định dạng DD/MM/YYYY
  //   return `${year}-${month}-${day}`; // Chuyển sang YYYY-MM-DD
  // };

  useEffect(() => {
    const updateFields = () => {
      const userInfo = state?.userInfo || {};
      console.log(userInfo);

      const updatedFields = [
        {
          for: "oldPassword",
          text: "Nhập mật khẩu cũ",
          type: "password",
          required: true,
        },
        {
          for: "newPassword",
          text: "Nhập mật khẩu mới",
          type: "password",
          required: true,
        },
        {
          for: "confirmNewPassword",
          text: "Xác nhận mật khẩu mới",
          type: "password",
          required: true,
        },
      ];

      setFields(updatedFields);
    };
    updateFields();
  }, [state]);

  return (
    <UserInfoLayout>
      <div className="flex w-full flex-col ">
        <div className="py-5 text-2xl text-white">ĐỔI MẬT KHẨU</div>
        {/* Main Content */}
        <UserChangePassComponent
          title="Thông tin khách hàng"
          layout="row"
          fields={fields}
          buttontitle="Đổi mật khẩu"
          onSubmit={handleSave}
        />
      </div>
    </UserInfoLayout>
  );
};

export default UserChangePass;

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
          for: "oldPass",
          text: "Nhập mật khẩu cũ",
          type: "password",
          required: true,
        },
        {
          for: "newPass",
          text: "Nhập mật khẩu mới",
          type: "password",
          required: true,
        },
        {
          for: "confirmNewPass",
          text: "Xác nhận mật khẩu mới",
          type: "password",
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
    <UserInfoLayout>
      <div className="flex items-center justify-center">
        {/* Main Content */}
        <div className=" text-black">
          <div className="   ">
            <UserChangePassComponent
              title="Thông tin khách hàng"
              layout="row"
              fields={fields}
              buttontitle="Đổi mật khẩu"
              onSubmit={handleSave}
            />
          </div>
        </div>
      </div>
    </UserInfoLayout>
  );
};

export default UserChangePass;

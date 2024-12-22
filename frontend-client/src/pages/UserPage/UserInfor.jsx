import React from "react";
import { useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import UserInforComponent from "../../Components/UserInforComponent";
import UserInfoLayout from "../../layouts/UserSpaceLayout";

const UserInfoPage = () => {
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
          // value: convertDateToISO(userInfo.dob) || "",
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
    <UserInfoLayout>
      <div className="flex items-center justify-center">
        {/* Main Content */}
        <div className=" text-black">
          <div className="   ">
            <UserInforComponent
              title="Thông tin khách hàng"
              fields={fields}
              buttontitle="Lưu thông tin"
              onSubmit={handleSave}
            />
          </div>
        </div>
      </div>
    </UserInfoLayout>
  );
};

export default UserInfoPage;

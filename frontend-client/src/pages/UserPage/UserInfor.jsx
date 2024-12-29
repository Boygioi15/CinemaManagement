import React from "react";
import { useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import UserInforComponent from "../../Components/UserInforComponent";
import UserInfoLayout from "../../layouts/UserSpaceLayout";
import { useAuth } from "../../Context/AuthContext";

const UserInfoPage = () => {
  const handleSave = (e) => {};
  const { state } = useLocation(); // Lấy thông tin từ state
  const [fields, setFields] = useState([]);
  const convertDateToISO = (isoDate) => {
    if (!isoDate) return ""; // Xử lý khi không có giá trị đầu vào
    return isoDate.split("T")[0]; // Tách phần trước "T"
  };
  const { user, setUser, loading } = useAuth();

  useEffect(() => {
    const updateFields = () => {
      const updatedFields = [
        {
          for: "name",
          text: "Họ và tên",
          type: "text",
          value: user.name || "",
          required: true,
        },
        {
          for: "birth",
          text: "Ngày sinh",
          type: "date",
          value: convertDateToISO(user.birth) || "",
          required: true,
        },
        {
          for: "email",
          text: "Email",
          type: "email",
          value: user.email || "",
          required: true,
        },
        {
          for: "phone",
          text: "Số điện thoại",
          type: "text",
          value: user.phone || "",
          required: true,
        },
      ];
      setFields(updatedFields);
    };
    updateFields();
  }, [state]);

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

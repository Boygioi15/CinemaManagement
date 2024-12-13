import React from "react";
import Sidebar from "../Components/SideBarUser";

const UserInfoLayout = ({ children }) => {
  const menuItems = [
    {
      label: "Thông tin người dùng",
      defaultImage: "/Images/account icon.svg",
      activeImage: "/Images/account icon active.svg",
      link: "/user/user-space/infor",
    },
    {
      label: "Tài khoản",
      defaultImage: "/Images/shield.svg",
      activeImage: "/Images/shield active.svg",
      link: "/user/user-space/change-pass",
    },
    {
      label: "Lịch sử giao dịch",
      defaultImage: "/Images/query_builder.svg",
      activeImage: "/Images/query_builder active.svg",
      link: "/user/user-space/trans-history",
    },
  ];

  return (
    <div className="h-screen">
      <div className="flex items-start justify-center ml-40 pt-28">
        {/* Sidebar */}
        <div className="flex">
          <Sidebar userName="Hoàng Tiến Đạt" menuItems={menuItems} />
        </div>

        {/* Main Content */}
        <div className="w-4/5">{children}</div>
      </div>
    </div>
  );
};

export default UserInfoLayout;

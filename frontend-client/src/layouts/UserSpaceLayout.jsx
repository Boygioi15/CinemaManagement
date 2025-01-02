import React from "react";
import Sidebar from "../Components/SideBarUser";
import { useAuth } from "../Context/AuthContext";

const UserInfoLayout = ({ children }) => {
  const { user, setUser, loading } = useAuth();
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
    <div className="h-screen w-full max-w-[3000px] mx-auto">
      <div className="flex flex-col lg:flex-row px-4 sm:px-8 md:px-16 lg:px-32 xl:px-40 py-[100px] gap-8 w-full h-full justify-center items-start">
        {/* Sidebar */}
        <div className="w-full lg:w-[300px] xl:w-[400px] text-xl">
          <Sidebar userName={user.name} menuItems={menuItems} />
        </div>

        {/* Main Content */}
        <div style={{maxWidth:"800px", display:"flex",flexDirection:"row",gap:"40px"}}className="flex-1 text-xl overflow-y-auto w-full  rounded-lg shadow-md ">
          {children}
        </div>
      </div>
    </div>
  );
};
export default UserInfoLayout;

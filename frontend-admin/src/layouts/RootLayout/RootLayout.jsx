import React, { useState, useEffect } from "react";
import { FiColumns, FiLayers } from "react-icons/fi";
import Navbar from "../../components/Navbar";
import { RxDashboard } from "react-icons/rx";
import Sidebar from "../../components/Sidebar";
import { Outlet } from "react-router";
import axios from "axios";

// const newTabs = [

// ];
const newTabs = [
  {
    name: "Danh sách phim",
    path: "/admin/phim",
    icon: <RxDashboard className="w-6 h-6" />,
  },
  {
    name: "Suất phim",
    path: "/admin/suat-phim",
    icon: <RxDashboard className="w-6 h-6" />,
  },
  {
    name: "Biểu đồ suất phim",
    path: "/admin/suat-phim/bieu-do",
    icon: <RxDashboard className="w-6 h-6" />,
  },
  {
    name: "Tạo vé trực tiếp",
    path: "/admin/tab/tao-ve",
    icon: <RxDashboard className="w-6 h-6" />,
  },
  {
    name: "Duyệt vé",
    path: "/admin/tab/duyet-ve",
    icon: <FiColumns className="w-6 h-6" />,
  },
  {
    name: "Bắp nước",
    path: "/admin/tab/phuc-vu-ve",
    icon: <FiColumns className="w-6 h-6" />,
  },
  {
    name: "Danh sách phòng",
    path: "/admin/co-so-vat-chat",
    icon: <RxDashboard className="w-6 h-6" />,
  },
  {
    name: "Báo cáo hằng ngày",
    path: "/admin/thong-ke/ngay",
    icon: <FiColumns className="w-6 h-6" />,
  },
  {
    name: "Doanh thu hằng năm",
    path: "/admin/thong-ke/nam",
    icon: <RxDashboard className="w-6 h-6" />,
  },
];
const RootLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [tabs, setTabs] = useState(newTabs);
  // useEffect(() => {
  //   const fetchRoles = async () => {
  //     console.log("I'm faking a request to back end");
  //     /*
  //     const response = await axios.get(`api/admin/roles/${JWT}`);
  //     setRoles(response.data);
  //     */
  //     setRoles(["ticket_offline", "bapNuoc"]); // Giá trị giả lập
  //   };

  //   fetchRoles();
  // }, []);

  // useEffect(() => {
  // const newTabs = [
  //   {
  //     name: "Vé Offline",
  //     path: "",
  //     icon: <RxDashboard className="w-6 h-6" />,
  //   },
  //   {
  //     name: "Vé Online",
  //     path: "/admin/tab/onlineticket",
  //     icon: <FiColumns className="w-6 h-6" />,
  //   },
  //   {
  //     name: "Bắp nước",
  //     path: "admin/tab/bapnuoc",
  //     icon: <FiLayers className="w-6 h-6" />,
  //   },
  // ];

  //   setTabs(newTabs);
  // }, []);
  // }, [roles]); // Khi `roles` thay đổi, cập nhật tabs
  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
        tabs={tabs}
      />
      <div className="flex-1 overflow-auto">
        <div className="p-6">
          <Navbar />
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default RootLayout;

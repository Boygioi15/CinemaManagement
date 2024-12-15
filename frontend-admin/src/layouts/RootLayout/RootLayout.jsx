import React, { useState, useEffect } from "react";
import { FiColumns, FiLayers } from "react-icons/fi";
import Navbar from "../../components/Navbar";
import { RxDashboard } from "react-icons/rx";
import Sidebar from "../../components/Sidebar";
import { Outlet } from "react-router";
import axios from "axios";

const newTabs = [
  {
    name: "Danh sách phim",
    path: "/admin/film",
    icon: <RxDashboard className="w-6 h-6" />,
  },
];
// const newTabs = [
//   {
//     name: "Vé Offline",
//     path: "/admin/tab/offlineticket",
//     icon: <RxDashboard className="w-6 h-6" />,
//   },
//   {
//     name: "Vé Online",
//     path: "/admin/tab/onlineticket",
//     icon: <FiColumns className="w-6 h-6" />,
//   },
//   {
//     name: "Bắp nước",
//     path: "/admin/tab/bapnuoc",
//     icon: <FiLayers className="w-6 h-6" />,
//   },
// ];

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
      <div className="flex-1 overflow-hidden">
        <div className="p-6">
          <Navbar />
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default RootLayout;

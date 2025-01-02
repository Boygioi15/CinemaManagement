import React, { useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { FiMenu } from "react-icons/fi";

const Sidebar = ({ isSidebarOpen, setIsSidebarOpen, tabs }) => {
  const location = useLocation(); // Lấy đường dẫn hiện tại

  useEffect(() => {
    const currentTab = tabs.find((tab) => tab.path === location.pathname);
    if (currentTab) {
      document.title = currentTab.name; // Đặt title của trang theo tên tab
    }
  }, [location.pathname, tabs]);

  return (
    <div
      className={`${
        isSidebarOpen ? "w-64" : "w-20"
      } bg-white shadow-lg transition-all duration-300 ease-in-out h-screen overflow-y-auto`}
    >
      <div className="flex items-center justify-between p-4 border-b">
        <h1
          className={`${
            isSidebarOpen ? "block" : "hidden"
          } font-bold text-xl text-gray-800`}
        >
          Admin Panel
        </h1>
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="p-2 rounded-lg hover:bg-gray-100"
        >
          <FiMenu className="w-6 h-6 text-gray-600" />
        </button>
      </div>
      <nav className="p-4">
        <ul className="space-y-2">
          {tabs.map((tab, index) => {
            const isActive = location.pathname === tab.path; // Kiểm tra tab hiện tại
            return (
              <li key={index}>
                <Link
                  to={tab.path}
                  className={`flex items-center p-3 rounded-lg ${
                    isActive ? "text-blue-500" : "text-gray-700"
                  } hover:bg-gray-100`}
                >
                  <span
                    className={`${
                      isActive ? "text-blue-500" : "text-gray-700"
                    }`}
                  >
                    {tab.icon}
                  </span>
                  {isSidebarOpen && (
                    <span className={`ml-3 ${isActive ? "font-bold" : ""}`}>
                      {tab.name}
                    </span>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;

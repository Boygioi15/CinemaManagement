import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { FiMenu, FiSearch, FiLogOut } from "react-icons/fi";

const Sidebar = ({ isSidebarOpen, setIsSidebarOpen, tabs }) => {
  const location = useLocation();
  const [searchTerm, setSearchTerm] = useState(""); // Trạng thái cho từ khóa tìm kiếm
  const [filteredTabs, setFilteredTabs] = useState(tabs); // Trạng thái cho danh sách tab đã lọc

  useEffect(() => {
    const currentTab = tabs.find((tab) => tab.path === location.pathname);
    if (currentTab) {
      document.title = currentTab.name;
    }
  }, [location.pathname, tabs]);

  // Hàm xử lý tìm kiếm
  useEffect(() => {
    const normalizedSearchTerm = searchTerm.normalize("NFC").toLowerCase();
    const results = tabs.filter((tab) =>
      tab.name.normalize("NFC").toLowerCase().includes(normalizedSearchTerm)
    );
    setFilteredTabs(results);
  }, [searchTerm, tabs]);

  return (
    <div
      className={`${
        isSidebarOpen ? "w-[300px]" : "w-20"
      } bg-white shadow-lg transition-all duration-300 ease-in-out h-screen overflow-y-auto`}
    >
      <div className="flex items-center justify-between p-4 border-b">
        <h1
          className={`${
            isSidebarOpen ? "block" : "hidden"
          } font-bold text-xl text-gray-800`}
        >
          Các màn hình quản lý
        </h1>
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="p-2 rounded-lg hover:bg-gray-100"
        >
          <FiMenu className="w-6 h-6 text-gray-600" />
        </button>
      </div>
      {isSidebarOpen && (
        <div className="p-4">
          <div className="relative">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Tìm kiếm chức năng..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      )}
      <nav className="p-4">
        <ul className="space-y-2">
          {filteredTabs.map((tab, index) => {
            const isActive = location.pathname === tab.path;
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
        <div className="mt-auto">
          <Link
            to="/admin/auth"
            className="flex items-center p-3 rounded-lg text-gray-700 hover:bg-gray-100"
          >
            {/* <span
              className={`w-6 h-6 flex items-center justify-center ${
                location.pathname === "/logout"
                  ? "text-blue-500"
                  : "text-gray-700"
              }`}
            > */}
            <span className="w-6 h-6 flex items-center justify-center text-gray-700">
              <FiLogOut className="w-6 h-6" />
            </span>
            {isSidebarOpen && <span className="ml-3">Đăng xuất</span>}
          </Link>
        </div>
      </nav>
    </div>
  );
};

export default Sidebar;

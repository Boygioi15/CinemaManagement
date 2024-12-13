import React from "react";
import { NavLink, useLocation } from "react-router-dom";

const Sidebar = ({ tabs }) => {
  const location = useLocation();

  return (
    <div className="w-64 bg-white shadow-md h-full flex flex-col">
      <div className="p-4 text-xl font-bold text-blue-500">
        Admin Panelsdfsdfdsfsdf
      </div>
      <nav className="flex flex-col gap-2 p-4">
        {tabs &&
          tabs.map((tab) => (
            <NavLink
              key={tab.path}
              to={tab.path}
              className={`flex items-center gap-3 px-4 py-2 rounded-lg text-gray-700 ${
                location.pathname === tab.path
                  ? "bg-blue-100 text-blue-500 font-bold"
                  : "hover:bg-gray-100"
              }`}
            >
              {/* Hiển thị icon tùy theo trạng thái */}
              <img
                src={location.pathname === tab.path ? tab.checked : tab.icon}
                alt={tab.name}
                className="w-6 h-6 object-contain"
              />
              {/* Tên tab */}
              <span>{tab.name}</span>
            </NavLink>
          ))}
      </nav>
    </div>
  );
};

export default Sidebar;

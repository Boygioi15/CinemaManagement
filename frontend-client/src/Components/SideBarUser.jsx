// Sidebar.jsx
import React, { useEffect, useState } from "react";
import { useLocation, Link } from "react-router-dom";
import { getCurrentPoint } from "../config/api";

const Sidebar = ({ userName, menuItems }) => {
  const location = useLocation();
  const [loyalPoint, setLoyalPoint] = useState(0);
  console.log("🚀 ~ Sidebar ~ loyalPoint:", loyalPoint)
  useEffect(() => {
    const fetchLoyalPoint = async () => {
      const response = await getCurrentPoint();
      console.log(response)
      setLoyalPoint(response.data.currentLoyalPoint);
    };
    fetchLoyalPoint();
  }, []);
  return (
    <div
      style={{ fontSize: "18px" }}
      className="bg-blue-600 text-white rounded-lg p-6 "
    >
      {/* User Profile Header */}
      <div className="mb-6">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center">
            <img
              src="/Images/account icon.svg"
              alt="User Avatar"
              className="w-6 h-6"
            />
          </div>
          <div>
            <p style={{ fontSize: "20px" }} className="font-medium text-lg">
              {userName} <span className="text-sm">{loyalPoint} points</span>
            </p>
          </div>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav>
        <ul className="space-y-2">
          {menuItems.map((item, index) => (
            <li key={index}>
              <Link
                to={item.link}
                className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors duration-150 ${
                  location.pathname === item.link
                    ? "bg-blue-700 text-yellow-300"
                    : "hover:bg-blue-500"
                }`}
              >
                <img
                  src={
                    location.pathname === item.link
                      ? item.activeImage
                      : item.defaultImage
                  }
                  alt={item.label}
                  className="w-6 h-6"
                />
                <span>{item.label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;

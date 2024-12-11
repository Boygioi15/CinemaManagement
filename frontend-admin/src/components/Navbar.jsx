import React from "react";

const Navbar = () => {
  return (
    <div className="h-16 bg-white shadow flex items-center justify-between px-6">
      <input
        type="text"
        placeholder="Search"
        className="border rounded-lg px-4 py-2 w-1/3"
      />
      <div className="flex items-center space-x-4">
        <span className="relative">
          <span className="w-2 h-2 bg-red-500 rounded-full absolute top-0 right-0"></span>
          <span className="text-gray-500">🔔</span>
        </span>
        <img
          src="https://via.placeholder.com/40"
          alt="User Avatar"
          className="w-10 h-10 rounded-full border"
        />
      </div>
    </div>
  );
};

export default Navbar;

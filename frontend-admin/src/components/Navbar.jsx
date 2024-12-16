import React from "react";
import { useState } from "react";
import { FiSearch, FiBell, FiUser } from "react-icons/fi";
const Navbar = () => {
  const [searchQuery, setSearchQuery] = useState("");
  return (
    <div className="flex items-center justify-between mb-6 bg-white rounded-lg shadow-sm p-3">
      <div className="flex items-center w-1/3">
        {/* <input
          type="text"
          placeholder="Search..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full px-4 py-2 rounded-lg focus:outline-none border"
        />
        <button className="ml-2 text-gray-600 hover:text-gray-800">
          <FiSearch className="w-5 h-5" />
        </button> */}
      </div>
      <div className="flex items-center space-x-4">
        <button className="p-2 text-gray-600 hover:text-gray-800 relative">
          <FiBell className="w-6 h-6" />
          <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>
        <button className="p-2 text-gray-600 hover:text-gray-800">
          <FiUser className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
};

export default Navbar;

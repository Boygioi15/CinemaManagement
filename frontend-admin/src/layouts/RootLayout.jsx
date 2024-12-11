import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

const RootLayout = ({ tabs }) => {
  console.log("Tabs:", tabs);
  return (
    // <div className="flex h-screen bg-gray-100">
    //   {/* Sidebar */}
    //   <Sidebar tabs={tabs} />

    //   {/* Main content */}
    //   <div className="flex flex-col flex-1">
    //     {/* Navbar */}
    //     <Navbar />
    //     {/* Dynamic content */}
    //     <div className="p-4 bg-white flex-1 overflow-y-auto">
    //       <Outlet />
    //     </div>
    //   </div>
    // </div>
    <div className="flex flex-col h-screen">
      {/* Navbar */}
      <div className="flex flex-1">
        {/* Sidebar */}
        <Sidebar tabs={tabs} />
        <Navbar />

        {/* Main Content */}
        <div className="flex-1 bg-gray-100 p-6 overflow-auto">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default RootLayout;

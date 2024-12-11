import React from "react";
import RootLayout from "../../layouts/RootLayout";

const tabs = [
  {
    name: "Danh sách phim",
    path: "/admin/film",
    icon: "/Iamges/element-1-black.svg",
    checked: "/Images/element-1-blue.svg",
  },
];
const AdminFilm = () => {
  console.log("Tabs:", tabs);
  return (
    <div>
      <h1 className="text-2xl font-bold">Quản lý phim</h1>
      <p>Đây là trang danh sách phim.</p>
    </div>
  );
};

export default AdminFilm;

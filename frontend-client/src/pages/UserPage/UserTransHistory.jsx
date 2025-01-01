import React from "react";
import { useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import UserInfoLayout from "../../layouts/UserSpaceLayout";
import Table from "../../Components/TableComponent";

const UserTransHistory = () => {
  const handleSave = (e) => {};
  const { state } = useLocation(); // Lấy thông tin từ state
  const [fields, setFields] = useState([]);
  // const convertDateToISO = (date) => {
  //   const [day, month, year] = date.split("/"); // Nếu date có định dạng DD/MM/YYYY
  //   return `${year}-${month}-${day}`; // Chuyển sang YYYY-MM-DD
  // };
  const headers = ["Mã đơn", "Tên phim", "Số lượng", "Ngày", "Tổng cộng"];
  const data = [
    ["001", "Phim A", "2", "2024-11-20", "200,000₫"],
    ["002", "Phim B", "1", "2024-11-21", "100,000₫"],
    [
      "003",
      "Bộ phim siêu dài dòng có tên này để test chiều rộng",
      "1",
      "2024-11-21",
      "100,000₫",
    ],
  ];

  useEffect(() => {
    const updateFields = () => {
      const userInfo = state?.userInfo || {};
      console.log(userInfo);

      const updatedFields = [];

      console.log("updated fields: ", updatedFields); // Kiểm tra kết quả
      setFields(updatedFields);
    };
    updateFields();
  }, [state]);

  return (
    <UserInfoLayout>
      <div className="flex w-full flex-col">
        <div className="py-5 text-2xl text-white">LỊCH SỬ GIAO DỊCH</div>
        <Table headers={headers} data={data} />
      </div>
    </UserInfoLayout>
  );
};

export default UserTransHistory;

import React, { useState, useEffect } from "react";
import UserInfoLayout from "../../layouts/UserSpaceLayout";
import { AiOutlineDown } from "react-icons/ai";

const UserTransHistory = () => {
  const [transactions, setTransactions] = useState([]); // Dữ liệu giao dịch hiện tại
  const [originalTransactions, setOriginalTransactions] = useState([]); // Lưu dữ liệu gốc
  const [activeCollapse, setActiveCollapse] = useState(null);

  useEffect(() => {
    document.title = "Lịch sử giao dịch";

    const sampleData = [
      {
        _id: "001",
        movieName: "Phim A",
        quantity: 2,
        date: "2024-11-20",
        total: "200,000₫",
        details: [
          {
            item: "Poca Khoai Tây 54gr",
            quantity: 1,
            price: "28,000₫",
            total: "28,000₫",
          },
          {
            item: "Nước suối Dasani 500ml",
            quantity: 1,
            price: "20,000₫",
            total: "20,000₫",
          },
          {
            item: "HSSV-NGƯỜI CAO TUỔI",
            quantity: 1,
            price: "45,000₫",
            total: "45,000₫",
          },
        ],
      },
      {
        _id: "002",
        movieName: "Phim B",
        quantity: 1,
        date: "2024-11-21",
        total: "100,000₫",
        details: [
          {
            item: "Combo A",
            quantity: 1,
            price: "100,000₫",
            total: "100,000₫",
          },
        ],
      },
    ];

    setTransactions(sampleData);
    setOriginalTransactions(sampleData); // Lưu lại dữ liệu gốc
  }, []);

  const toggleCollapse = (transactionId) => {
    setActiveCollapse((prev) =>
      prev === transactionId ? null : transactionId
    );
  };

  const handleFilterChange = (formattedDate) => {
    if (formattedDate) {
      const filteredData = originalTransactions.filter(
        (t) => t.date === formattedDate
      );
      setTransactions(filteredData);
    } else {
      setTransactions(originalTransactions); // Reset về danh sách gốc
    }
  };

  const resetFilter = () => {
    setTransactions(originalTransactions);
    document.getElementById("dateFilter").value = ""; // Xóa giá trị trong ô lọc
  };

  return (
    <UserInfoLayout>
      <div className="w-full">
        <h1 className="text-xl font-bold text-white mb-6">Lịch sử giao dịch</h1>

        <div className="mb-4 flex items-center gap-4">
          <label htmlFor="dateFilter" className="text-white">
            Lọc theo ngày:
          </label>
          <input
            type="date"
            id="dateFilter"
            className="p-2 rounded border text-black focus:outline-none focus:ring-2 focus:ring-purple-500"
            onChange={(e) => {
              const selectedDate = e.target.value;
              if (selectedDate) {
                const formattedDate = new Date(selectedDate).toLocaleDateString(
                  "vi-VN",
                  {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                  }
                ); // Định dạng dd/mm/yyyy
                handleFilterChange(formattedDate);
              }
            }}
          />
          <button
            onClick={resetFilter}
            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-700"
          >
            Reset bộ lọc
          </button>
        </div>

        {transactions.length === 0 ? (
          <p className="text-white">Không tìm thấy giao dịch nào.</p>
        ) : (
          transactions.map((transaction) => (
            <div
              key={transaction._id}
              className="bg-white rounded-lg mb-4 p-4 overflow-hidden transition-all duration-500 ease-in-out"
              style={{
                maxHeight:
                  activeCollapse === transaction._id ? "1000px" : "120px",
              }}
            >
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-semibold text-lg text-gray-700">
                    Mã đơn: {transaction._id}
                  </p>
                  <p className="text-sm text-gray-500">
                    Tên phim: {transaction.movieName}
                  </p>
                  <p className="text-sm text-gray-500">
                    Ngày: {transaction.date}
                  </p>
                  <p className="text-sm text-gray-500">
                    Tổng cộng: {transaction.total}
                  </p>
                </div>
                <AiOutlineDown
                  className={`text-gray-500 cursor-pointer transition-transform duration-500 ease-in-out ${
                    activeCollapse === transaction._id ? "rotate-180" : ""
                  }`}
                  onClick={() => toggleCollapse(transaction._id)}
                />
              </div>

              {activeCollapse === transaction._id && (
                <div className="mt-2">
                  <table className="w-full table-auto border-collapse rounded-lg overflow-hidden text-sm">
                    <thead>
                      <tr className="bg-[#623a96] text-white">
                        <th className="p-2 text-center">STT</th>
                        <th className="p-2 text-left">Mặt hàng</th>
                        <th className="p-2 text-center">Số lượng</th>
                        <th className="p-2 text-right">Đơn giá (VND)</th>
                        <th className="p-2 text-right">Thành tiền (VND)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {transaction.details.map((detail, index) => (
                        <tr key={index} className="hover:bg-gray-50">
                          <td className="p-2 border-b text-gray-700 text-center">
                            {index + 1}
                          </td>
                          <td className="p-2 border-b text-gray-700 text-left">
                            {detail.item}
                          </td>
                          <td className="p-2 border-b text-gray-700 text-center">
                            {detail.quantity}
                          </td>
                          <td className="p-2 border-b text-gray-700 text-right">
                            {detail.price}
                          </td>
                          <td className="p-2 border-b text-gray-700 text-right">
                            {detail.total}
                          </td>
                        </tr>
                      ))}
                      <tr className="bg-gray-100 font-bold">
                        <td
                          colSpan={4}
                          className="p-2 text-right text-gray-700"
                        >
                          Tổng tiền (VND)
                        </td>
                        <td className="p-2 text-right text-gray-700">
                          {transaction.total}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </UserInfoLayout>
  );
};

export default UserTransHistory;

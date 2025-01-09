import React, { useState, useEffect } from "react";
import UserInfoLayout from "../../layouts/UserSpaceLayout";
import { FaChevronDown } from "react-icons/fa";
import { getAllOrderByUserId } from "../../config/api";
import { FaSpinner } from "react-icons/fa";
import CustomButton from "../../Components/button";

const UserTransHistory = () => {
  const [transactions, setTransactions] = useState([]);
  const [originalTransactions, setOriginalTransactions] = useState([]);
  const [activeCollapse, setActiveCollapse] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true); // Thêm trạng thái loading
  const itemsPerPage = 3;

  useEffect(() => {
    handleGetAllOrder();
    document.title = "Lịch sử giao dịch";
  }, []);

  const handleGetAllOrder = async () => {
    setIsLoading(true); // Bắt đầu loading
    const response = await getAllOrderByUserId();
    setTransactions(response.data);
    setOriginalTransactions(response.data);
    setIsLoading(false); // Kết thúc loading
  };

  const toggleCollapse = (transactionId) => {
    setActiveCollapse((prev) => {
      if (prev.includes(transactionId)) {
        // Nếu đã mở, thì đóng lại
        return prev.filter((id) => id !== transactionId);
      } else {
        // Nếu chưa mở, thêm vào
        return [...prev, transactionId];
      }
    });
  };

  const handleFilterChange = () => {
    const fromDate = document.getElementById("fromDateFilter").value;
    const toDate = document.getElementById("toDateFilter").value;

    // Kiểm tra nếu ngày bắt đầu lớn hơn ngày kết thúc
    if (fromDate && toDate && new Date(fromDate) > new Date(toDate)) {
      alert("Ngày bắt đầu không được lớn hơn ngày kết thúc!");
      return;
    }

    // Chuyển đổi fromDate và toDate về định dạng local date (yyyy-mm-dd)
    const formattedFromDate = fromDate
      ? new Date(fromDate).toLocaleDateString()
      : null;
    const formattedToDate = toDate
      ? new Date(toDate).toLocaleDateString()
      : null;

    const filteredData = originalTransactions.filter((t) => {
      // Chuyển transactionDate về định dạng local (yyyy-mm-dd)
      const transactionDate = new Date(t.createdDate).toLocaleDateString();

      // So sánh chỉ phần ngày
      return (
        (!formattedFromDate || transactionDate >= formattedFromDate) &&
        (!formattedToDate || transactionDate <= formattedToDate)
      );
    });

    setTransactions(filteredData);
  };

  const resetFilter = () => {
    setTransactions(originalTransactions);
    document.getElementById("fromDateFilter").value = "";
    document.getElementById("toDateFilter").value = "";
  };

  const paginateData = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return transactions.slice(startIndex, endIndex);
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  return (
    <UserInfoLayout>
      <div className="w-full">
        <h1 className="text-xl font-bold text-white mb-6">Lịch sử giao dịch</h1>

        <div className="mb-4 flex items-center gap-4">
          <label htmlFor="fromDateFilter" className="text-white">
            Từ ngày:
          </label>
          <input
            type="date"
            id="fromDateFilter"
            className="p-2 rounded border text-black focus:outline-none focus:ring-2 focus:ring-purple-500"
            onChange={(e) => {
              const fromDate = e.target.value;
              const toDateInput = document.getElementById("toDateFilter");

              // Cập nhật thuộc tính min cho ngày kết thúc
              toDateInput.min = fromDate;

              handleFilterChange();
            }}
          />

          <label htmlFor="toDateFilter" className="text-white">
            Đến ngày:
          </label>
          <input
            type="date"
            id="toDateFilter"
            className="p-2 rounded border text-black focus:outline-none focus:ring-2 focus:ring-purple-500"
            onChange={(e) => {
              const toDate = e.target.value;
              const fromDateInput = document.getElementById("fromDateFilter");

              // Cập nhật thuộc tính max cho ngày bắt đầu
              fromDateInput.max = toDate;

              handleFilterChange();
            }}
          />
          <CustomButton
            defaultColor="#663399"
            gradientFrom="#FF6D00"
            gradientTo="#ffc107"
            textColor="#f2ea28"
            hoverTextColor="#f2ea28" // Màu chữ khi hover
            borderColor="#f2ea28"
            className=""
            text="Làm mới bộ lọc"
            onClick={resetFilter}
          />
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center h-32">
            <FaSpinner className="text-white text-3xl animate-spin" />
          </div>
        ) : transactions.length === 0 ? (
          <p className="text-white">Không tìm thấy giao dịch nào.</p>
        ) : (
          paginateData().map((transaction) => (
            <div
              key={transaction.orderId}
              className="bg-white rounded-lg mb-4 p-4 overflow-hidden transition-all duration-500 ease-in-out"
              style={{
                maxHeight: activeCollapse.includes(transaction.orderId)
                  ? "1000px"
                  : "120px",
              }}
            >
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-semibold text-lg text-gray-700">
                    Mã đơn: {transaction?.verifyCode}
                  </p>

                  <p className="text-sm text-gray-500">
                    Ngày:{" "}
                    {new Date(transaction?.createdDate).toLocaleDateString()}
                  </p>
                </div>
                <FaChevronDown
                  className={`text-gray-500 cursor-pointer transition-transform duration-500 ease-in-out ${
                    activeCollapse.includes(transaction.orderId)
                      ? "rotate-180"
                      : ""
                  }`}
                  onClick={() => toggleCollapse(transaction.orderId)}
                />
              </div>

              {activeCollapse.includes(transaction.orderId) && (
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
                      {transaction?.filmShow?.tickets.map((ticket, index) => (
                        <tr
                          key={`ticket-${index}`}
                          className="hover:bg-gray-50"
                        >
                          <td className="p-2 border-b text-gray-700 text-center">
                            {index + 1}
                          </td>
                          <td className="p-2 border-b text-gray-700 text-left">
                            {ticket?.name}
                          </td>
                          <td className="p-2 border-b text-gray-700 text-center">
                            {ticket?.quantity}
                          </td>
                          <td className="p-2 border-b text-gray-700 text-right">
                            {Number(ticket?.price).toLocaleString()}
                          </td>

                          <td className="p-2 border-b text-gray-700 text-right">
                            {(ticket?.quantity * ticket.price).toLocaleString()}
                          </td>
                        </tr>
                      ))}

                      {transaction?.items.map((detail, index) => (
                        <tr key={index} className="hover:bg-gray-50">
                          <td className="p-2 border-b text-gray-700 text-center">
                            {index +
                              1 +
                              (transaction?.filmShow?.tickets?.length || 0)}
                          </td>
                          <td className="p-2 border-b text-gray-700 text-left">
                            {detail?.name}
                          </td>
                          <td className="p-2 border-b text-gray-700 text-center">
                            {detail?.quantity}
                          </td>
                          <td className="p-2 border-b text-gray-700 text-right">
                            {Number(detail?.price).toLocaleString()}
                          </td>
                          <td className="p-2 border-b text-gray-700 text-right">
                            {(
                              detail?.quantity * detail?.price
                            ).toLocaleString()}
                          </td>
                        </tr>
                      ))}

                      {transaction?.pointUsage !== null && (
                        <tr className="bg-gray-100 font-bold ">
                          <td
                            colSpan={4}
                            className="p-2 text-right text-gray-700"
                          >
                            Tổng điểm sử dụng (VND)
                          </td>
                          <td className="p-2 text-right text-gray-700">
                            {(transaction?.pointUsage?.pointUsed).toLocaleString()}
                            (
                            {(
                              -(
                                transaction?.pointUsage?.pointUsed *
                                transaction?.pointUsage?.pointToMoneyRatio
                              ) / 100
                            ).toLocaleString()}
                            VNĐ)
                          </td>
                        </tr>
                      )}

                      {transaction?.totalPriceAfterDiscount !== null && (
                        <tr className="bg-gray-100 font-bold ">
                          <td
                            colSpan={4}
                            className="p-2 text-right text-gray-700"
                          >
                            Tổng khuyến mãi (VND)
                          </td>
                          <td className="p-2 text-right text-gray-700">
                            -
                            {(
                              (transaction?.totalPrice || 0) -
                              (transaction?.totalPriceAfterDiscount || 0) -
                              ((transaction?.pointUsage?.pointUsed || 0) *
                                (transaction?.pointUsage?.pointToMoneyRatio ||
                                  0)) /
                                100
                            ).toLocaleString()}
                          </td>
                        </tr>
                      )}

                      <tr className="bg-gray-100 font-bold ">
                        <td
                          colSpan={4}
                          className="p-2 text-right text-gray-700"
                        >
                          Tổng tiền (VND)
                        </td>
                        <td className="p-2 text-right text-gray-700">
                          {transaction?.totalPriceAfterDiscount?.toLocaleString() ||
                            transaction?.totalPrice.toLocaleString()}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          ))
        )}

        <div className="flex justify-center mt-4">
          <CustomButton
            defaultColor="#663399"
            gradientFrom="#FF6D00"
            gradientTo="#ffc107"
            textColor="#f2ea28"
            hoverTextColor="#f2ea28" // Màu chữ khi hover
            borderColor="#f2ea28"
            className=""
            text="Trang trước"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          />

          <span className="mx-4 mt-2 text-white">Trang {currentPage}</span>
          <CustomButton
            defaultColor="#663399"
            gradientFrom="#FF6D00"
            gradientTo="#ffc107"
            textColor="#f2ea28"
            hoverTextColor="#f2ea28" // Màu chữ khi hover
            borderColor="#f2ea28"
            className=""
            text="Trang sau"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage * itemsPerPage >= transactions.length}
          />
        </div>
      </div>
    </UserInfoLayout>
  );
};

export default UserTransHistory;

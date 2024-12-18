import { useState, useEffect } from "react";
import Table from "../../components/Table";
import axios from "axios";
import { FaPrint } from "react-icons/fa6";
import { TbCancel } from "react-icons/tb";
import slugify from "slugify";
import OrderDetailModal from "../../components/Ticket/OrderDetailModal";
import TicketCancelModal from "../../components/Ticket/TicketCancelModal";

export default function PhucVuVe() {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const [tableSearchQuery, setTableSearchQuery] = useState("");

  const [isTicketModalOpen, setIsTicketModalOpen] = useState(false);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const handlePrintClick = (order) => {
    setSelectedOrder(order);
    setIsTicketModalOpen(true);
  };

  const handleCancelClick = (order) => {
    setSelectedOrder(order);
    setIsCancelModalOpen(true);
  };
  const handleCloseModal = () => {
    setIsTicketModalOpen(false);
    setIsCancelModalOpen(false);
    setSelectedOrder(null);
  };

  const fetchOrder = async () => {
    try {
      const response = await axios.get("http://localhost:8000/api/orders");
      // Lọc những order có printed === false
      const filteredOrders = response.data.filter(
        (order) => order.printed === true
      );
      setOrders(filteredOrders);
    } catch (error) {
      console.error("Error fetching films:", error);
    }
  };

  // Gọi API khi component được render lần đầu
  useEffect(() => {
    fetchOrder();
  }, []);
  if (!orders) {
    return;
  }
  const itemsPerPage = 7;
  const filteredData = orders.filter(
    (item) =>
      (item.filmName &&
        slugify(item.filmName).includes(slugify(tableSearchQuery))) ||
      (item.verifyCode &&
        slugify(item.verifyCode).includes(slugify(tableSearchQuery))) ||
      (item.customerInfo.name &&
        slugify(item.customerInfo.name).includes(slugify(tableSearchQuery))) ||
      (item.time && item.time.includes(tableSearchQuery))
  );

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = filteredData.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  const columns = [
    {
      header: "Tên khách hàng",
      key: "customerName",
      render: (_, row) => row.customerInfo.name,
    },
    { header: "Verify Code", key: "verifyCode" },
    {
      header: "Ngày chiếu",
      key: "date",
      render: (value) => new Date(value).toLocaleDateString(),
    },
    {
      header: "Trạng thái",
      key: "status",
      render: (_, row) => {
        let statusText = "";
        let statusClass = "";

        if (row.served) {
          statusText = "Đã phục vụ";
          statusClass = "bg-green-100 text-green-700";
        } else if (!row.served) {
          statusText = "Chưa phục vụ";
          statusClass = "bg-green-100 text-green-700";
        } else {
          statusText = "Đã hủy";
          statusClass = "bg-red-100 text-red-700";
        }

        return (
          <span className={`px-2 py-1 rounded-full text-xs ${statusClass}`}>
            {statusText}
          </span>
        );
      },
    },
    {
      header: "Hành động",
      key: "actions",
      render: (_, row) => (
        <div className="flex space-x-3">
          <button className="text-blue-600 hover:text-blue-800">
            <FaPrint
              className="w-4 h-4"
              onClick={() => handlePrintClick(row)}
            />
          </button>
          <button className="text-red-600 hover:text-red-800">
            <TbCancel
              className="w-5 h-5"
              onClick={() => handleCancelClick(row)}
            />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          Thông tin bắp nước
        </h2>
        <div className="flex items-center w-1/4">
          <input
            type="text"
            placeholder="Nhập code..."
            value={tableSearchQuery}
            onChange={(e) => setTableSearchQuery(e.target.value)}
            className="w-full px-4 py-2 rounded-lg focus:outline-none border"
          />
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm overflow-x-auto">
        <Table columns={columns} data={paginatedData} />

        <div className="flex items-center justify-between px-6 py-4 bg-gray-50">
          <button
            onClick={() => setCurrentPage(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-4 py-2 text-sm text-gray-600 bg-white rounded-lg shadow-sm disabled:opacity-50"
          >
            Trước
          </button>
          <span className="text-sm text-gray-600">
            Trang {currentPage} trên {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-4 py-2 text-sm text-gray-600 bg-white rounded-lg shadow-sm disabled:opacity-50"
          >
            Tiếp
          </button>
        </div>
      </div>

      <OrderDetailModal
        order={selectedOrder}
        isOpen={isTicketModalOpen}
        onClose={handleCloseModal}
      />
      <TicketCancelModal
        isOpen={isCancelModalOpen}
        onClose={handleCloseModal}
      />
    </div>
  );
}

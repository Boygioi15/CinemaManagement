import { useState, useEffect } from "react";
import Table from "../../components/Table";
import axios from "axios";
import { FaPrint } from "react-icons/fa6";
import { TbCancel } from "react-icons/tb";
import slugify from "slugify";
import TicketDetailModal from "../../components/Ticket/TicketDetailModal";
import TicketCancelModal from "../../components/Ticket/TicketCancelModal";
import Dialog from "../../components/ConfirmDialog";
import SuccessDialog from "../../components/SuccessDialog";
import RefreshLoader from "../../components/Loading";

const InVe = () => {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const [tableSearchQuery, setTableSearchQuery] = useState("");

  const [isTicketModalOpen, setIsTicketModalOpen] = useState(false);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [dialogData, setDialogData] = useState({ title: "", message: "" });

  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);

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
    setIsConfirmModalOpen(false);
    setIsSuccessModalOpen(false);

    setSelectedOrder(null);
  };

  const handleConfirmModal = (order) => {
    setIsConfirmModalOpen(true);
    setSelectedOrder(order);
    setDialogData({
      title: "Xác nhận",
      message: "Bạn chắc chắn muốn in vé này ?",
    });
  };

  const handleRefresh = async () => {
    setLoading(true);
    fetchOrder();
    setTimeout(() => {
      setLoading(false);
      setIsSuccessModalOpen(true);
    }, 2000);
  };

  const handleConfirmClick = async () => {
    console.log(selectedOrder._id);

    try {
      const response = await axios.put(
        `http://localhost:8000/api/orders/${selectedOrder._id}/print`
      );
      if (response.status === 200) {
        fetchOrder();
      }
    } catch (error) {
      console.error("Error marking order as printed:", error);
    }

    handleRefresh();
    setDialogData({
      title: "Thành công",
      message: "In vé thành công",
    });
    setIsTicketModalOpen(false);
    setIsConfirmModalOpen(false);
  };

  const fetchOrder = async () => {
    try {
      const response = await axios.get("http://localhost:8000/api/orders");
      // Lọc những order có printed === false
      const filteredOrders = response.data.filter(
        (order) => order.printed === false
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
    { header: "Tên phim", key: "filmName" },
    { header: "Verify Code", key: "verifyCode" },
    {
      header: "Ngày chiếu",
      key: "date",
      render: (value) => new Date(value).toLocaleDateString(),
    },
    { header: "Giờ chiếu", key: "time" },
    { header: "Tổng tiền", key: "totalMoney" },
    {
      header: "Trạng thái",
      key: "status",
      render: (_, row) => {
        let statusText = "";
        let statusClass = "";

        if (row.invalidreason) {
          statusText = "Từ chối in vé";
          statusClass = "bg-red-100 text-red-800";
        } else if (!row.printed) {
          statusText = "Chưa in";
          statusClass = "bg-green-100 text-green-700";
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
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Thông tin vé</h2>
        <div className="flex items-center w-1/4">
          <input
            type="text"
            placeholder="Enter code here..."
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

      <TicketDetailModal
        order={selectedOrder}
        isOpen={isTicketModalOpen}
        onClose={handleCloseModal}
        onConfirm={handleConfirmModal}
      />
      <TicketCancelModal
        isOpen={isCancelModalOpen}
        onClose={handleCloseModal}
      />

      <Dialog
        isOpen={isConfirmModalOpen}
        title={dialogData.title}
        message={dialogData.message}
        onClose={handleCloseModal}
        onConfirm={handleConfirmClick}
      />

      <SuccessDialog
        isOpen={isSuccessModalOpen}
        title={dialogData.title}
        message={dialogData.message}
        onClose={handleCloseModal}
      />

      <RefreshLoader isOpen={loading} />
    </div>
  );
};

export default InVe;

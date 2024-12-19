import { useState, useEffect } from "react";
import Table from "../../components/Table";
import axios from "axios";
import { FaPrint } from "react-icons/fa6";
import { FiSearch } from "react-icons/fi";
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
  const [reason, setReason] = useState("");

  const [tableSearchQuery, setTableSearchQuery] = useState("");
  const [statusQuery, setStatusQuery] = useState("all");

  const [isTicketModalOpen, setIsTicketModalOpen] = useState(false);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [dialogData, setDialogData] = useState({ title: "", message: "" });
  const [view, setView] = useState(true);

  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);

  //Mở modal chi tiết vé
  const handlePrintClick = (order) => {
    setSelectedOrder(order);
    setIsTicketModalOpen(true);
    setView(true);
  };

  //Mở modal xem thông tin vé ( ko có nút in)
  const handleViewClick = (order) => {
    setSelectedOrder(order);
    setIsTicketModalOpen(true);
    setView(false);
  };

  //Mở modal nhập lý do hủy vé
  const handleCancelClick = (order) => {
    setSelectedOrder(order);
    setIsCancelModalOpen(true);
  };

  //Nhấn nút in vé
  const handleReason = (reason) => {
    setReason(reason);
    console.log(selectedOrder);
    console.log("a");
    console.log(reason);
    setIsConfirmModalOpen(true);

    setDialogData({
      title: "Xác nhận",
      message: "Bạn chắc chắn muốn hủy vé này ?",
    });
  };

  //Đóng modal
  const handleCloseModal = () => {
    setIsTicketModalOpen(false);
    setIsCancelModalOpen(false);
    setIsConfirmModalOpen(false);
    setIsSuccessModalOpen(false);

    setSelectedOrder(null);
  };

  //Nhấn nút in vé
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

  //Xác nhận hủy vé
  const handleCancelConfirmClick = async () => {
    try {
      const response = await axios.put(
        `http://localhost:8000/api/orders/${selectedOrder._id}/disapprove-print`,
        { reason }
      );
      if (response.status === 200) {
        console.log("thành công");
      }
    } catch (error) {
      console.error("Error canceling order:", error);
    }

    handleRefresh();
    setDialogData({
      title: "Thành công",
      message: "Hủy vé thành công",
    });
    setIsCancelModalOpen(false);
    setIsConfirmModalOpen(false);
  };

  //Xác nhận in vé
  const handleConfirmClick = async () => {
    console.log(selectedOrder._id);
    if (
      dialogData.title === "Xác nhận" &&
      dialogData.message.includes("Bạn chắc chắn muốn hủy vé này ?")
    ) {
      await handleCancelConfirmClick();
    } else {
      try {
        const response = await axios.put(
          `http://localhost:8000/api/orders/${selectedOrder._id}/print`
        );
        if (response.status === 200) {
          console.log("thành công");
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
    }
  };

  const fetchOrder = async () => {
    try {
      const response = await axios.get("http://localhost:8000/api/orders");
      // Lọc những order có printed === false
      setOrders(response.data);
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
  const filteredData = orders.filter((order) => {
    // Lọc theo mã code
    const matchesCode =
      !tableSearchQuery ||
      order.verifyCode?.toLowerCase().includes(tableSearchQuery.toLowerCase());

    // Lọc theo trạng thái
    const matchesStatus =
      statusQuery === "all" ||
      (!order.printed && statusQuery === "Chưa in") ||
      (order.printed && statusQuery === "Đã in") ||
      (order.invalidReason_Printed && statusQuery === "Từ chối in vé") ||
      (order.invalidReason_Served && statusQuery === "Từ chối phục vụ") ||
      (!order.served && statusQuery === "Chưa phục vụ") ||
      (order.served && statusQuery === "Đã phục vụ");

    // Kết hợp cả hai điều kiện
    return matchesCode && matchesStatus;
  });

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = filteredData.slice(
    startIndex,
    startIndex + itemsPerPage
  );
  const statusOptions = [
    "Chưa in",
    "Đã in",
    "Từ chối in vé",
    "Từ chối phục vụ",
    "Chưa phục vụ",
    "Đã phục vụ",
  ];

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

        if (row.invalidReason_Printed) {
          statusText = "Từ chối in vé";
          statusClass = "bg-red-100 text-red-800";
        } else if (row.invalidReason_Served) {
          statusText = "Từ chối phục vụ";
          statusClass = "bg-red-100 text-red-800";
        } else if (!row.printed) {
          statusText = "Chưa in";
          statusClass = "bg-yellow-100 text-yellow-800";
        } else if (row.served) {
          statusText = "Đã phục vụ";
          statusClass = "bg-green-100 text-green-800";
        } else if (row.printed) {
          statusText = "Đã in";
          statusClass = "bg-blue-100 text-blue-800";
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
          <button className="text-gray-600 hover:text-gray-800">
            <FiSearch
              className="w-4 h-4"
              onClick={() => handleViewClick(row)}
            />
          </button>
          <button
            className="text-blue-600 hover:text-blue-800"
            disabled={
              row.printed ||
              row.served ||
              row.invalidReason_Printed ||
              row.invalidReason_Served
            }
          >
            <FaPrint
              className="w-4 h-4"
              onClick={() => handlePrintClick(row)}
            />
          </button>
          <button
            className="text-red-600 hover:text-red-800"
            disabled={
              row.printed ||
              row.served ||
              row.invalidReason_Printed ||
              row.invalidReason_Served
            }
          >
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
        <div className="flex items-center gap-4">
          <div className="flex items-center w-1/4">
            <input
              type="text"
              placeholder="Nhập code..."
              value={tableSearchQuery}
              onChange={(e) => setTableSearchQuery(e.target.value)}
              className="w-full px-4 py-2 rounded-lg focus:outline-none border"
            />
          </div>
          <div className="flex items-center w-[300px]">
            <select
              name="status"
              value={statusQuery}
              onChange={(e) => setStatusQuery(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="" disabled>
                <span className="text-gray-400">Trạng thái</span>
              </option>
              <option value="all">Tất cả</option>
              {statusOptions.map((status, index) => (
                <option key={index} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </div>
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
        view={view}
      />
      <TicketCancelModal
        isOpen={isCancelModalOpen}
        onClose={handleCloseModal}
        onConfirm={handleReason}
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

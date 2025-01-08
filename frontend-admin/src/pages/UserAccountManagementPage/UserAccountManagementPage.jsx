import { useState, useEffect } from "react";
import Table from "../../components/Table";
import axios from "axios";
import { FaPrint } from "react-icons/fa6";
import { FiSearch } from "react-icons/fi";
import { TbCancel } from "react-icons/tb";
import { BiRefresh } from "react-icons/bi";
import slugify from "slugify";
import TicketDetailModal from "../../components/Modal/TicketDetailModal";
import TicketCancelModal from "../../components/Modal/TicketCancelModal";
import Dialog from "../../components/Dialog/ConfirmDialog";
import SuccessDialog from "../../components/Dialog/SuccessDialog";
import RefreshLoader from "../../components/Loading";
import formatCurrencyNumber from "../../ulitilities/formatCurrencyNumber";

const UserAccountManagementPage = () => {
  const [users, setUsers] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [reason, setReason] = useState("");

  const [cusEmailQuery, setCusEmailQuery] = useState("");
  const [cusNameQuery, setCusNameQuery] = useState("");
  const [cusPhoneQuery, setCusPhoneQuery] = useState("");
  const [statusQuery, setStatusQuery] = useState("");

  const [isTicketModalOpen, setIsTicketModalOpen] = useState(false);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [dialogData, setDialogData] = useState({ title: "", message: "" });
  const [title, setTitle] = useState("");
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
    setTitle("Lý do từ chối vé");
    setIsCancelModalOpen(true);
  };

  //Nhấn nút xác nhận hủy vé
  const handleReason = (reason) => {
    setReason(reason);
    console.log("Nhấn xác nhận hủy vé");
    console.log("Thông tin đơn: " + JSON.stringify(selectedOrder));
    console.log("Lý do: " + reason);
    setIsConfirmModalOpen(true);

    setDialogData({
      title: "Xác nhận",
      message: "Bạn chắc chắn muốn hủy vé này ?",
    });
  };
  useEffect(() => {
    console.log("Modal open: " + isConfirmModalOpen);
  }, [isConfirmModalOpen]);
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
    //fetchOrder();
    setTimeout(() => {
      setLoading(false);
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
      alert("Thao tác thất bại, lỗi: " + error.response.data.msg);
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
        alert("Thao tác thất bại, lỗi: " + error.response.data.msg);
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

  const fetchUser = async () => {
    try {
      const response = await axios.get("http://localhost:8000/api/user/user");
      // Lọc những order có printed === false
      setUsers(response.data);
    } catch (error) {
      alert("Thao tác thất bại, lỗi: " + error.response.data.msg);
    }
  };

  // Gọi API khi component được render lần đầu
  useEffect(() => {
    fetchUser();
  }, []);
  if (!users) {
    return;
  }

  const userss = [
    { id: 1, name: "North", email: "dat1@gmail.com", phone: 24334530 },
    { id: 2, name: "South", email: "dat2@gmail.com", phone: 18533334 },
    { id: 3, name: "East", email: "dat3@gmail.com", phone: 27534534 },
    { id: 4, name: "West", email: "dat4@gmail.com", phone: 21345340 },
    { id: 5, name: "Central", email: "dat5@gmail.com", phone: 23434545 },
    { id: 6, name: "Northwest", email: "dat6@gmail.com", phone: 19433455 },
  ];

  console.log(users);

  const itemsPerPage = 7;
  const filteredData = userss.filter((order) => {
    const matchesName = cusNameQuery
      ? order.customerInfo.name
          .toLowerCase()
          .includes(cusNameQuery.toLowerCase())
      : true;

    // Lọc theo mã code
    const matchesEmail = cusEmailQuery
      ? order.email.toLowerCase().includes(cusEmailQuery.toLowerCase())
      : true;
    const matchesPhone = cusPhoneQuery
      ? order.phone.toLowerCase().includes(cusPhoneQuery.toLowerCase())
      : true;

    // Kết hợp cả hai điều kiện
    return matchesPhone && matchesEmail && matchesName;
  });

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = filteredData.slice(
    startIndex,
    startIndex + itemsPerPage
  );
  const statusOptions = ["Chặn", "Không chặn"];

  const columns = [
    { header: "Tên người dùng", key: "name" },
    { header: "Email", key: "email" },
    { header: "Số điện thoại", key: "phone" },
    {
      header: "Bị chặn",
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
          statusText = "Hoạt động";
          statusClass = "bg-green-100 text-green-800";
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
          Thông tin người dùng
        </h2>
        <div className="flex items-center gap-4">
          <button
            onClick={handleRefresh}
            className="r p-4 rounded-full hover:bg-gray-100 transition-all duration-300"
            disabled={loading}
          >
            <BiRefresh
              className={`text-4xl text-black hover:text-black ${
                loading
                  ? "animate-spin"
                  : "hover:rotate-180 transition-transform duration-300"
              }`}
            />
          </button>
          <div className="flex items-center w-[300px]">
            <input
              type="text"
              placeholder="Tên người dùng...."
              value={cusNameQuery}
              onChange={(e) => setCusNameQuery(e.target.value)}
              className="w-full px-4 py-2 rounded-lg focus:outline-none border"
            />
          </div>
          <div className="flex items-center w-1/4">
            <input
              type="text"
              placeholder="Nhập email..."
              value={cusEmailQuery}
              onChange={(e) => setCusEmailQuery(e.target.value)}
              className="w-full px-4 py-2 rounded-lg focus:outline-none border"
            />
          </div>
          <div className="flex items-center w-1/4">
            <input
              type="text"
              placeholder="Nhập SĐT..."
              value={cusPhoneQuery}
              onChange={(e) => setCusPhoneQuery(e.target.value)}
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

        {filteredData.length > 0 && (
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
        )}
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
        title={title}
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

export default UserAccountManagementPage;

import { useState, useEffect, useRef, useMemo } from "react";
import Table from "../../components/Table";
import axios from "axios";
import { FaPrint } from "react-icons/fa6";
import { FaCheckCircle } from "react-icons/fa";
import { FiSearch } from "react-icons/fi";
import { TbCancel } from "react-icons/tb";
import { BsSortDown } from "react-icons/bs";
import { BiRefresh } from "react-icons/bi";
import slugify from "slugify";
import TicketDetailModal from "../../components/Modal/TicketDetailModal";
import TicketCancelModal from "../../components/Modal/TicketCancelModal";
import Dialog from "../../components/Dialog/ConfirmDialog";
import SuccessDialog from "../../components/Dialog/SuccessDialog";
import RefreshLoader from "../../components/Loading";
import formatCurrencyNumber from "../../ulitilities/formatCurrencyNumber";
import { useReactToPrint } from "react-to-print";

const TicketPrintListPage = () => {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [reason, setReason] = useState("");
  const [sortOption, setSortOption] = useState("");

  const [filmNameQuery, setFilmNameQuery] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [cusNameQuery, setCusNameQuery] = useState("");
  const [tableSearchQuery, setTableSearchQuery] = useState("");
  const [statusQuery, setStatusQuery] = useState("all");

  const [isTicketModalOpen, setIsTicketModalOpen] = useState(false);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [dialogData, setDialogData] = useState({ title: "", message: "" });
  const [title, setTitle] = useState("");
  const [view, setView] = useState(true);

  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);

  const [printContentRef, setPrintContentRef] = useState(null);

  // Ref cho modal chi tiết vé
  const ticketModalRef = useRef();
  const [isPrintPdf, setIsPrintPdf] = useState(false);

  // Hàm in
  const handlePrint = useReactToPrint({
    contentRef: printContentRef, // Dùng contentRef
    documentTitle: "Chi tiết vé",
    onAfterPrint: () => {
      console.log("In hoàn tất!");
    },
    onPrintError: (errorLocation, error) => {
      console.error(`Lỗi in tại ${errorLocation}:`, error);
    },
  });
  //Mở modal chi tiết vé
  const handlePrintPdf = (order) => {
    setSelectedOrder(order);
    setIsTicketModalOpen(true);
    setView(true);
    setIsPrintPdf(true); // Đánh dấu nguồn là từ `handlePrintPdf`
  };

  //Mở modal chi tiết vé
  const handlePrintClick = (order) => {
    setSelectedOrder(order);
    setIsTicketModalOpen(true);
    setView(true);
    setIsPrintPdf(false); // Đánh dấu nguồn là từ `handlePrintClick`
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
  useEffect(() => {}, [isConfirmModalOpen]);
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
    setPrintContentRef(ticketModalRef); // Lưu giá trị ref hiện tại
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

    // Nếu modal được mở bởi `handlePrintPdf`, chỉ in
    if (isPrintPdf) {
      console.log("Thực hiện in từ PDF");
      handlePrint(); // Gọi in
      setIsTicketModalOpen(false); // Đóng modal sau khi in
      setIsConfirmModalOpen(false);
      return;
    }

    // Nếu không phải từ `handlePrintPdf`, thực hiện cập nhật trạng thái
    if (
      dialogData.title === "Xác nhận" &&
      dialogData.message.includes("Bạn chắc chắn muốn hủy vé này ?")
    ) {
      await handleCancelConfirmClick();
    } else {
      console.log("ticketModalRef.current:", ticketModalRef.current);
      try {
        const response = await axios.put(
          `http://localhost:8000/api/orders/${selectedOrder._id}/print`
        );
        if (response.status === 200) {
          console.log("Cập nhật trạng thái thành công");
        }
      } catch (error) {
        alert("Thao tác thất bại, lỗi: " + error.response.data.msg);
        console.error("Lỗi cập nhật trạng thái:", error);
      }

      handleRefresh();
      setTimeout(() => {
        setDialogData({
          title: "Thành công",
          message: "Cập nhật trạng thái thành công",
        });
        setIsTicketModalOpen(false);
        setIsConfirmModalOpen(false);
      }, 1000); // Đợi 1 giây để đảm bảo hoàn thành trước khi đóng modal
    }
  };

  const fetchOrder = async () => {
    try {
      const response = await axios.get("http://localhost:8000/api/orders");
      // Lọc những order có printed === false
      setOrders(
        response.data.map((item) => ({
          ...item,
          date: new Date(item.date).toLocaleDateString("vi-VN"), // Định dạng chuẩn của Việt Nam là dd/mm/yyyy
        }))
      );
    } catch (error) {
      alert("Thao tác thất bại, lỗi: " + error.response.data.msg);
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

  const filteredData = useMemo(() => {
    let filtered = orders.filter((order) => {
      const matchesDate = selectedDate
        ? order.date &&
          new Date(order.date).toLocaleDateString() ===
            new Date(selectedDate).toLocaleDateString()
        : true;

      const matchesfilmName = filmNameQuery
        ? order.filmName?.toLowerCase().includes(filmNameQuery.toLowerCase())
        : true;

      const matchesName = cusNameQuery
        ? order.customerInfo.name
            .toLowerCase()
            .normalize("NFC")
            .includes(cusNameQuery.toLowerCase().normalize("NFC"))
        : true;

      // Lọc theo mã code
      const matchesCode =
        !tableSearchQuery ||
        order.verifyCode
          ?.toLowerCase()
          .includes(tableSearchQuery.toLowerCase());

      // Lọc theo trạng thái
      const matchesStatus =
        statusQuery === "all" ||
        (!order.printed &&
          statusQuery === "Chưa in" &&
          !order.invalidReason_Printed) ||
        (order.invalidReason_Printed && statusQuery === "Từ chối in vé") ||
        (order.printed &&
          statusQuery === "Đã in" &&
          !order.served &&
          !order.invalidReason_Served) ||
        (order.invalidReason_Served && statusQuery === "Từ chối phục vụ") ||
        (order.served && statusQuery === "Đã phục vụ");

      return (
        matchesCode &&
        matchesStatus &&
        matchesName &&
        matchesDate &&
        matchesfilmName
      );
    });

    if (sortOption === "Theo ngày") {
      filtered = filtered.sort((a, b) => {
        const dateA = new Date(a.showDate.split("/").reverse().join("-")); // Đổi thành "yyyy-mm-dd"
        const dateB = new Date(b.showDate.split("/").reverse().join("-"));
        return dateA - dateB; // So sánh ngày tăng dần
      });
    } else if (sortOption === "Theo giờ") {
      filtered = filtered.sort((a, b) => {
        return (
          new Date(`2023-01-01 ${a.showTime}`) -
          new Date(`2023-01-01 ${b.showTime}`)
        );
      });
    }

    return filtered;
  }, [
    orders,
    filmNameQuery,
    selectedDate,
    statusQuery,
    tableSearchQuery,
    cusNameQuery,
    sortOption,
  ]);

  // Reset sort option when date is selected/deselected
  useEffect(() => {
    setSortOption("");
  }, [selectedDate]);

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = filteredData.slice(
    startIndex,
    startIndex + itemsPerPage
  );
  const statusOptions = [
    "Chưa in",
    "Từ chối in vé",
    "Đã in",
    "Từ chối phục vụ",
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
    {
      header: "Tổng tiền trước thanh toán(VNĐ)",
      key: "totalMoney",
      render: (value) => formatCurrencyNumber(value),
      style: { textAlign: "center" },
    },
    {
      header: "Tổng tiền sau giảm giá(VNĐ)",
      key: "totalMoneyAfterDiscount",
      render: (value) => {
        if (value) {
          return formatCurrencyNumber(value);
        }
        return "Không được giảm giá";
      },
    },
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
            <FaPrint className="w-4 h-4" onClick={() => handlePrintPdf(row)} />
          </button>
          <button
            className="text-green-600 hover:text-green-800"
            disabled={
              row.printed ||
              row.served ||
              row.invalidReason_Printed ||
              row.invalidReason_Served
            }
            onClick={() => handlePrintClick(row)} // Gọi hàm cập nhật trạng thái
          >
            <FaCheckCircle />
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
          <h1 className="text-xl font-bold text-gray-800">Lọc:</h1>
          <div className="flex items-center w-[200px]">
            <input
              type="text"
              placeholder="Tên khách hàng...."
              value={cusNameQuery}
              onChange={(e) => setCusNameQuery(e.target.value)}
              className="w-full px-4 py-2 rounded-lg focus:outline-none border"
            />
          </div>
          <div className="flex items-center w-[200px]">
            <input
              type="text"
              placeholder="Tên phim...."
              value={filmNameQuery}
              onChange={(e) => setFilmNameQuery(e.target.value)}
              className="w-full px-4 py-2 rounded-lg focus:outline-none border"
            />
          </div>
          <div className="flex items-center w-[200px]">
            <input
              type="text"
              placeholder="Nhập code..."
              value={tableSearchQuery}
              onChange={(e) => setTableSearchQuery(e.target.value)}
              className="w-full px-4 py-2 rounded-lg focus:outline-none border"
            />
          </div>
          <input
            type="date"
            value={selectedDate || ""}
            onChange={(e) => {
              const localDate = e.target.value; // Lấy trực tiếp giá trị yyyy-mm-dd
              setSelectedDate(localDate); // Cập nhật state
            }}
            className="p-2 border rounded-md"
          />
          <div className="flex items-center w-[200px]">
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
        <div className="ml-20 flex items-center gap-4">
          <span className="text-xl font-bold text-gray-800 ">Sắp xếp:</span>
          <div className="relative inline-block w-64 ">
            <select
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
              className="block appearance-none w-full bg-white border border-gray-300 hover:border-gray-400 px-4 py-2 pr-8 rounded-lg leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Không sắp xếp</option>
              {!selectedDate && <option value="Theo ngày">Theo ngày</option>}
              {selectedDate && <option value="Theo giờ">Theo giờ</option>}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
              <BsSortDown className="h-4 w-4" />
            </div>
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
        ref={ticketModalRef}
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

export default TicketPrintListPage;

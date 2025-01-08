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

  const handleDeleteFilter = () => {
    setFilmNameQuery("");
    setCusNameQuery("");
    setSelectedDate("");
    setTableSearchQuery("");
    setStatusQuery("");
  };

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
        `http://localhost:8000/api/orders/${selectedOrder.orderId}/disapprove-print`,
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
    console.log(selectedOrder.orderId);

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
          `http://localhost:8000/api/orders/${selectedOrder.orderId}/print`
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
      setLoading(true);
      const response = await axios.get("http://localhost:8000/api/orders");
      // Lọc những order có printed === false
      setOrders(response.data.data);
    } catch (error) {
      alert("Thao tác thất bại, lỗi: " + error.response.data.msg);
    } finally {
      setLoading(false); // End loading when API call is complete
    }
  };

  // Gọi API khi component được render lần đầu
  useEffect(() => {
    fetchOrder();
  }, []);
  if (!orders) {
    return;
  }

  console.log(orders);

  const itemsPerPage = 7;

  const filteredData = useMemo(() => {
    let filtered = orders.filter((order) => {
      const matchesDate = selectedDate
        ? order.filmShow && order.filmShow.showDate &&
          new Date(order.filmShow.showDate).toLocaleDateString() ===
            new Date(selectedDate).toLocaleDateString()
        : true;

      const matchesfilmName = filmNameQuery
        ? order.filmShow.filmName
            ?.toLowerCase()
            .includes(filmNameQuery.toLowerCase())
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
        (!order.offlineService.printed &&
          statusQuery === "Chưa in" &&
          !order.offlineService.invalidReason_Printed) ||
        (order.offlineService.invalidReason_Printed &&
          statusQuery === "Từ chối in vé") ||
        (order.offlineService.printed &&
          statusQuery === "Đã in" &&
          !order.offlineService.served &&
          !order.offlineService.invalidReason_Served) ||
        (order.offlineService.invalidReason_Served &&
          statusQuery === "Từ chối phục vụ") ||
        (order.offlineService.served && statusQuery === "Đã phục vụ");

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
        const dateA = a.filmShow
          ? new Date(a.filmShow.showDate.split("/").reverse().join("-"))
          : new Date(0); // Nếu null, mặc định là ngày nhỏ nhất
        const dateB = b.filmShow
          ? new Date(b.filmShow.showDate.split("/").reverse().join("-"))
          : new Date(0);
        return dateA - dateB; // So sánh ngày tăng dần
      });
    } else if (sortOption === "Theo giờ") {
      filtered = filtered.sort((a, b) => {
        const timeA = a.filmShow
          ? new Date(`2023-01-01 ${a.filmShow.showTime}`)
          : new Date(0); // Nếu null, mặc định là thời gian nhỏ nhất
        const timeB = b.filmShow
          ? new Date(`2023-01-01 ${b.filmShow.showTime}`)
          : new Date(0);
        return timeA - timeB; // So sánh giờ tăng dần
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
    {
      header: "Tên phim",
      key: "filmName",
      render: (_, row) => row.filmShow?.filmName || "Không có dữ liệu",
    },
    { header: "Verify Code", key: "verifyCode" },
    {
      header: "Ngày chiếu",
      key: "showDate",
      render: (_, row) => {
        const showDate = row.filmShow?.showDate; // Lấy giá trị ngày chiếu
        return showDate
          ? new Date(showDate).toLocaleDateString() // Hiển thị ngày nếu hợp lệ
          : "Không có dữ liệu"; // Hiển thị chuỗi mặc định nếu không có dữ liệu
      },
    },
    {
      header: "Giờ chiếu",
      key: "time",
      render: (_, row) => row.filmShow?.showTime || "Không có dữ liệu",
    },
    {
      header: "Tổng tiền trước thanh toán(VNĐ)",
      key: "totalPrice",
      render: (_, row) => row.totalPrice.toLocaleString(),
    },
    {
      header: "Tổng tiền sau giảm giá(VNĐ)",
      key: "totalPriceAfterDiscount",
      render: (_, row) => {
        const totalPrice = row.totalPrice; // Lấy tổng tiền ban đầu
        const totalPriceAfterDiscount = row.totalPriceAfterDiscount; // Lấy tổng tiền sau giảm giá

        // Nếu không có giảm giá hoặc tổng tiền sau giảm bằng tổng tiền
        if (
          !totalPriceAfterDiscount ||
          totalPriceAfterDiscount === totalPrice
        ) {
          return "Không được giảm giá";
        }

        // Hiển thị giá trị giảm giá
        return totalPriceAfterDiscount.toLocaleString();
      },
    },
    {
      header: "Trạng thái",
      key: "status",
      render: (_, row) => {
        let statusText = "";
        let statusClass = "";

        if (row.offlineService.invalidReason_Printed) {
          statusText = "Từ chối in vé";
          statusClass = "bg-red-100 text-red-800";
        } else if (row.offlineService.invalidReason_Served) {
          statusText = "Từ chối phục vụ";
          statusClass = "bg-red-100 text-red-800";
        } else if (!row.offlineService.printed) {
          statusText = "Chưa in";
          statusClass = "bg-yellow-100 text-yellow-800";
        } else if (row.offlineService.served) {
          statusText = "Đã phục vụ";
          statusClass = "bg-green-100 text-green-800";
        } else if (row.offlineService.printed) {
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
              row.offlineService.printed ||
              row.offlineService.served ||
              row.offlineService.invalidReason_Printed ||
              row.offlineService.invalidReason_Served
            }
          >
            <FaPrint className="w-4 h-4" onClick={() => handlePrintPdf(row)} />
          </button>
          <button
            className="text-green-600 hover:text-green-800"
            disabled={
              row.offlineService.printed ||
              row.offlineService.served ||
              row.offlineService.invalidReason_Printed ||
              row.offlineService.invalidReason_Served
            }
            onClick={() => handlePrintClick(row)} // Gọi hàm cập nhật trạng thái
          >
            <FaCheckCircle />
          </button>
          <button
            className="text-red-600 hover:text-red-800"
            disabled={
              row.offlineService.printed ||
              row.offlineService.served ||
              row.offlineService.invalidReason_Printed ||
              row.offlineService.invalidReason_Served
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
          <button
            className="ml-4 px-4 py-2 text-gray-600 bg-gray-300 rounded-lg hover:bg-gray-400"
            onClick={() => handleDeleteFilter()}
          >
            Xóa lọc
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm overflow-x-auto">
        <Table columns={columns} data={paginatedData} />

        {orders.length > 0 && (
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

import { useState, useEffect } from "react";
import Table from "../../components/Table";
import axios from "axios"
import { FiEdit2, FiTrash2 } from "react-icons/fi";
import { FaPrint } from "react-icons/fa6";
import { TbCancel } from "react-icons/tb";
import slugify from "slugify";
import TicketDetailModal from "../../components/Ticket/TicketDetailModal";
import TicketCancelModal from "../../components/Ticket/TicketCancelModal";

const InVe = () => {
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

  const fetchOrder = async () => {
    try {
      const response = await axios.get("http://localhost:8000/api/orders");
      setOrders(response.data); // Lưu dữ liệu vào state
    } catch (error) {
      console.error("Error fetching films:", error);
    }
  };

  // Gọi API khi component được render lần đầu
  useEffect(() => {
    fetchOrder();
  }, []);
  if(!orders){
    return;
  }
  const itemsPerPage = 20;
  const filteredData = orders.filter(
    (item) =>
      item.filmName && slugify(item.filmName).includes(slugify(tableSearchQuery)) ||
      item.verifyCode && slugify(item.verifyCode).includes(slugify(tableSearchQuery)) ||
      item.customerInfo.name && slugify(item.customerInfo.name).includes(slugify(tableSearchQuery)) ||
      item.time && item.time.includes(tableSearchQuery)
  );

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = filteredData.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  const columns = [
    { header: "Tên khách hàng", key: "customer" },
    { header: "Tên phim", key: "filmname" },
    { header: "Verify Code", key: "code" },
    { header: "Ngày chiếu", key: "daterelease" },
    { header: "Giờ chiếu", key: "hourelease" },
    { header: "Tổng tiền", key: "total" },
    {
      header: "Trạng thái",
      key: "status",
      render: (value) => (  
        <span
          className={
            value === "Active"
              ? "px-2 py-1 rounded-full text-xs bg-green-100 text-green-800"
              : "px-2 py-1 rounded-full text-xs bg-red-100 text-red-800"
          }
        >
          {value}
        </span>
      ),
    },
    {
      header: "Hành động",
      key: "actions",
      render: (_, row) => (
        <div className="flex space-x-3">
          <button className="text-blue-600 hover:text-blue-800">
            <FaPrint className="w-4 h-4" onClick={()=>handlePrintClick(row)}/>
          </button>
          <button className="text-red-600 hover:text-red-800">
            <TbCancel className="w-5 h-5" onClick={()=>handleCancelClick(row)}/>
          </button>
        </div>
      ),
    },
  ];

  
  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          Ticket Information
        </h2>
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
            Previous
          </button>
          <span className="text-sm text-gray-600">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-4 py-2 text-sm text-gray-600 bg-white rounded-lg shadow-sm disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>

      <TicketDetailModal
        order={selectedOrder}
        isOpen={isTicketModalOpen}
        // onClose={handleCloseModal}
        // film={selectedFilm}
        // onSave={handleSaveChanges}
      />
      <TicketCancelModal isOpen={isCancelModalOpen}/>

    </div>
  );
};

export default InVe;

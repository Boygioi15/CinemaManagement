import { useState, useEffect } from "react";
import Table from "../../components/Table";
import { FiEdit2, FiTrash2 } from "react-icons/fi";
import ItemModal from "../../components/AdditionalItem/modal";
import axios from "axios";

const FilmShow = () => {
  const [tableSearchQuery, setTableSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [mode, setMode] = useState("add");
  const [filmshows, setFilmShows] = useState([]);

  //   const fetchItems = async () => {
  //     try {
  //       const response = await axios.get(
  //         "http://localhost:8000/api/additional-items"
  //       );
  //       setItems(response.data.data); // Lưu dữ liệu vào state
  //     } catch (error) {
  //       console.error("Error fetching items:", error);
  //     }
  //   };

  //   // Gọi API khi component được render lần đầu
  //   useEffect(() => {
  //     fetchItems();
  //   }, []);

  const handleEditClick = (item) => {
    setSelectedItem(item);
    setMode("edit");
    setIsDetailModalOpen(true);
  };

  const handleAddClick = () => {
    setMode("add");
    setSelectedItem(null);
    setIsDetailModalOpen(true);
  };

  const handleEditConfirm = (item) => {
    console.log(`Lấy được data:${item.name} `);
    setIsDetailModalOpen(false);
  };
  const columns = [
    { header: "Tên phim", key: "film" },
    { header: "Ngày chiếu", key: "showDate" },
    { header: "Suất chiếu", key: "showTime" },
    { header: "Phòng", key: "roomId" },
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
          <button
            className="text-blue-600 hover:text-blue-800"
            onClick={() => handleEditClick(row)}
          >
            <FiEdit2 className="w-4 h-4" />
          </button>
          <button className="text-red-600 hover:text-red-800">
            <FiTrash2 className="w-4 h-4" />
          </button>
        </div>
      ),
    },
  ];
  const itemsPerPage = 6;

  const filteredData = filmshows.filter(
    (filmshows) =>
      filmshows.name.toLowerCase().includes(tableSearchQuery.toLowerCase()) ||
      filmshows.email.toLowerCase().includes(tableSearchQuery.toLowerCase()) ||
      filmshows.role.toLowerCase().includes(tableSearchQuery.toLowerCase())
  );

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = filteredData.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  return (
    <div>
      <div className="mb-6 flex justify-between items-center pr-10">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Thông tin suất chiếu
          </h2>
          <div className="flex items-center w-[300px]">
            <input
              type="text"
              placeholder="Enter film name here..."
              value={tableSearchQuery}
              onChange={(e) => setTableSearchQuery(e.target.value)}
              className="w-full px-4 py-2 rounded-lg focus:outline-none border"
            />
          </div>
        </div>
        <button
          className="px-4 py-2 bg-black text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
          onClick={() => handleAddClick()}
        >
          Add FilmShow +
        </button>
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

      <ItemModal
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        onSave={handleEditConfirm}
        item={selectedItem}
        mode={mode}
      />
    </div>
  );
};

export default FilmShow;

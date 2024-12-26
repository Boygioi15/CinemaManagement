import React from "react";
import Table from "../../components/Table";
import { FiSearch } from "react-icons/fi";
import SeatModal from "../../components/SeatModal";
import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router";

const InfrasManage = () => {
  const navigate = useNavigate();

  const [tableSearchQuery, setTableSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("add");
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAddRoomModalOpen, setIsAddRoomModalOpen] = useState(false);

  const [seatStates, setSeatStates] = useState({});
  const [rooms, setRooms] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState(null);

  const fetchRoom = async () => {
    try {
      const response = await axios.get("http://localhost:8000/api/rooms");
      // Lọc những order có printed === false
      setRooms(response.data.data);
    } catch (error) {
      console.error("Error fetching films:", error);
    }
  };

  // Gọi API khi component được render lần đầu
  useEffect(() => {
    fetchRoom();
  }, []);
  if (!rooms) {
    return;
  }

  console.log(rooms);

  const handleEditClick = () => {
    setModalMode("edit");
    setIsModalOpen(true);
  };

  const handleAddRoom = () => {
    navigate("/create-room");
  };

  const handleCloseAddRoomModal = () => {
    setIsAddRoomModalOpen(false);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleSaveChanges = (formData) => {
    if (modalMode === "edit") {
      console.log("Saving changes", formData);
    } else {
      console.log("Adding new film", formData);
    }
    handleCloseModal();
  };

  const columns = [
    { header: "Tên phòng", key: "roomName" },
    {
      header: "Hành động",
      key: "actions",
      render: (_, row) => (
        <div className="flex space-x-3">
          <button
            className="text-blue-600 hover:text-blue-800"
            onClick={() => handleEditClick(row)}
          >
            <FiSearch className="w-4 h-4" />
          </button>
          {/* <button className="text-red-600 hover:text-red-800">
            <FiTrash2 className="w-4 h-4" />
          </button> */}
        </div>
      ),
    },
  ];

  const itemsPerPage = 6;

  const filteredData = rooms.filter((item) =>
    item.roomName.toLowerCase().includes(tableSearchQuery.toLowerCase())
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
            Thông tin phòng
          </h2>
          <div className="flex items-center w-[300px]">
            <input
              type="text"
              placeholder="Nhập tên phòng..."
              value={tableSearchQuery}
              onChange={(e) => setTableSearchQuery(e.target.value)}
              className="w-full px-4 py-2 rounded-lg focus:outline-none border"
            />
          </div>
        </div>
        <button
          className="px-4 py-2 bg-black text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
          onClick={() => handleAddRoom()}
        >
          Thêm phòng mới +
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

      <SeatModal
        isOpen={isAddRoomModalOpen}
        onClose={handleCloseAddRoomModal}
        onSave={handleSaveChanges}
        mode={modalMode}
      />
    </div>
  );
};

export default InfrasManage;

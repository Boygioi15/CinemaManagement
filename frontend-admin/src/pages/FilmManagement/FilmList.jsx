import React from "react";
import Table from "../../components/Table";
import { FiEdit2, FiTrash2 } from "react-icons/fi";
import FilmModal from "../../components/FilmModal";
import { useState, useEffect } from "react";
import axios from "axios";
import Dialog from "../../components/ConfirmDialog";
import SuccessDialog from "../../components/SuccessDialog";

const AdminFilm = () => {
  const [films, setFilms] = useState([]);

  const [tableSearchQuery, setTableSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedFilm, setSelectedFilm] = useState(null);
  const [itemToDelete, setItemToDelete] = useState(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("add");
  const [dialogData, setDialogData] = useState({ title: "", message: "" });
  const [formData, setFormData] = useState("");

  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
  const [isSuccessDialogOpen, setIsSuccessDialogOpen] = useState(false);

  const fetchFilms = async () => {
    try {
      const response = await axios.get("http://localhost:8000/api/films");
      setFilms(response.data.data); // Lưu dữ liệu vào state
    } catch (error) {
      console.error("Error fetching films:", error);
    }
  };

  // Gọi API khi component được render lần đầu
  useEffect(() => {
    fetchFilms();
  }, []);

  const handleEditClick = (film) => {
    setSelectedFilm(film);
    setModalMode("edit");
    setIsModalOpen(true);
  };

  const handleAddClick = () => {
    setSelectedFilm(null);
    setModalMode("add");
    setIsModalOpen(true);
  };

  const handleDeleteClick = (item) => {
    setItemToDelete(item);
    setIsConfirmDialogOpen(true);
    setDialogData({
      title: "Confirm Delete",
      message:
        "Are you sure you want to delete this item? This action cannot be undone.",
    });
  };

  const handleDeleteConfirm = () => {
    setIsConfirmDialogOpen(false);
    setIsSuccessDialogOpen(true);
    setDialogData({
      title: "Success",
      message: "Item deleted successfully",
    });
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedFilm(null);
  };

  const handleSaveChanges = (formData) => {
    if (modalMode === "edit") {
      setIsConfirmDialogOpen(true);
      setDialogData({
        title: "Confirm update",
        message: "Do you want to update this film ?",
      });
      setFormData(formData);
      console.log("Saving changes", formData);
    } else {
      console.log("Adding new film", formData);
    }
    handleCloseModal();
  };

  const columns = [
    { header: "Tên phim", key: "name" },
    { header: "Thời lượng", key: "filmDuration" },
    { header: "Quốc gia", key: "originatedCountry" },
    { header: "Độ tuổi", key: "ageSymbol" },
    { header: "Mô tả", key: "filmDescription" },
    { header: "Thể loại", key: "otherDescription" },
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
          <button
            className="text-red-600 hover:text-red-800"
            onClick={() => handleDeleteClick(row)}
          >
            <FiTrash2 className="w-4 h-4" />
          </button>
        </div>
      ),
    },
  ];

  const itemsPerPage = 6;

  const filteredData = films.filter((item) =>
    item.name.toLowerCase().includes(tableSearchQuery.toLowerCase())
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
            Film Information
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
          Add Film +
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

      <FilmModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        film={selectedFilm}
        onSave={handleSaveChanges}
        mode={modalMode}
      />

      <Dialog
        isOpen={isConfirmDialogOpen}
        onClose={() => setIsConfirmDialogOpen(false)}
        onConfirm={handleDeleteConfirm}
        title={dialogData.title}
        message={dialogData.message}
      />
      <SuccessDialog
        isOpen={isSuccessDialogOpen}
        onClose={() => setIsSuccessDialogOpen(false)}
        title={dialogData.title}
        message={dialogData.message}
      />
    </div>
  );
};

export default AdminFilm;
// ádadasdasdasdasjkdasjlksalkd

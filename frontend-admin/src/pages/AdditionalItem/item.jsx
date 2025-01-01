import { useState, useEffect } from "react";
import Table from "../../components/Table";
import { FiEdit2, FiTrash2 } from "react-icons/fi";
import ItemModal from "../../components/AdditionalItem/modal";
import Dialog from "../../components/Film/ConfirmDialog";
import SuccessDialog from "../../components/Film/SuccessDialog";
import RefreshLoader from "../../components/Loading";
import axios from "axios";

const AdditionalItem = () => {
  const [tableSearchQuery, setTableSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  const [mode, setMode] = useState("add");
  const [actionType, setActionType] = useState("");
  const [items, setItems] = useState([]);

  const [dialogData, setDialogData] = useState({ title: "", message: "" });
  const [loading, setLoading] = useState(false);

  const fetchItems = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8000/api/additional-items"
      );
      setItems(response.data.data); // Lưu dữ liệu vào state
    } catch (error) {
      console.error("Error fetching items:", error);
    }
  };

  // Gọi API khi component được render lần đầu
  useEffect(() => {
    fetchItems();
  }, []);

  //set action cho modal
  const openConfirmDialog = (action, item = null) => {
    setActionType(action); // Xác định loại hành động
    setSelectedItem(item); // Gán item được chọn nếu có
    setDialogData({
      title: "Xác nhận",
      message: getDialogMessage(action, item), // Lấy nội dung message phù hợp
    });
    setIsConfirmModalOpen(true);
  };

  //lấy message
  const getDialogMessage = (action, item) => {
    switch (action) {
      case "delete":
        return `Bạn chắc chắn muốn xóa sản phẩm này ?`;
      case "add":
        return "Bạn chắc chắn muốn thêm sản phẩm này ?";
      case "edit":
        return `Bạn chắc chắn muốn cập nhật sản phẩm này ?`;
      default:
        return "Xác nhận hành động?";
    }
  };

  //lấy message thành công
  const getSuccessMessage = (action) => {
    switch (action) {
      case "delete":
        return "Xóa sản phẩm thành công";
      case "add":
        return "Thêm sản phẩm thành công";
      case "edit":
        return "Cập nhật sản phẩm thành công";
      default:
        return "Thao tác thành công";
    }
  };

  //Chọn cập nhật item
  const handleEditClick = (item) => {
    setSelectedItem(item);
    setMode("edit");
    setIsDetailModalOpen(true);
  };

  //thêm mới item
  const handleAddClick = () => {
    setMode("add");
    setSelectedItem(null);
    setIsDetailModalOpen(true);
  };

  //chọn xóa item
  const handleDelete = (item) => {
    openConfirmDialog("delete", item);
  };

  const handleRefresh = async () => {
    setLoading(true);
    fetchItems();
    setTimeout(() => {
      setLoading(false);
    }, 2000);
  };

  const handleConfirmClick = async () => {
    
    try {
      if (actionType === "delete") {
        await axios.delete(
          `http://localhost:8000/api/additional-items/${selectedItem._id}`
        );
      } else if (actionType === "edit") {
        
        const res = await axios.put(
          `http://localhost:8000/api/additional-items/${selectedItem._id}`,
          selectedItem
        );
        
      } else if (actionType === "add") {
        console.log("haha: ", selectedItem);
        const formData = new FormData();
        formData.append("name", selectedItem.name);
        formData.append("price", selectedItem.price);
        formData.append("thumbnailFile", selectedItem.file);
        await axios.post(
          "http://localhost:8000/api/additional-items",
          formData
        );
      }
      await handleRefresh(); // Làm mới dữ liệu sau khi thành công
      // Hiển thị thông báo thành công
      setDialogData({
        title: "Thành công",
        message: getSuccessMessage(actionType),
      });
      setIsSuccessModalOpen(true);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setIsConfirmModalOpen(false);
    }
  };

  const handleEditConfirm = (item) => {
    setSelectedItem(item);

    // Xác định loại hành động dựa trên chế độ hiện tại
    const action = mode === "add" ? "add" : "edit";

    // Gọi dialog xác nhận với loại hành động tương ứng
    openConfirmDialog(action, item);
  };

  const columns = [
    { header: "Tên sản phẩm", key: "name" },
    { header: "Giá", key: "price" },
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
            onClick={() => handleDelete(row)}
          >
            <FiTrash2 className="w-4 h-4" />
          </button>
        </div>
      ),
    },
  ];
  const itemsPerPage = 6;

  const filteredData = items.filter((item) =>
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
            Thông tin sản phẩm
          </h2>
          <div className="flex items-center w-[300px]">
            <input
              type="text"
              placeholder="Nhập tên sản phẩm..."
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
          Thêm sản phẩm +
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
      <ItemModal
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        onSave={handleEditConfirm}
        item={selectedItem}
        mode={mode}
      />
      <Dialog
        isOpen={isConfirmModalOpen}
        title={dialogData.title}
        message={dialogData.message}
        onClose={() => setIsConfirmModalOpen(false)}
        onConfirm={handleConfirmClick}
      />
      <SuccessDialog
        isOpen={isSuccessModalOpen && !loading}
        title={dialogData.title}
        message={dialogData.message}
        onClose={() => setIsSuccessModalOpen(false)}
      />
      <RefreshLoader isOpen={loading} />
    </div>
  );
};

export default AdditionalItem;

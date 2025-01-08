import { useState, useEffect, useMemo } from "react";
import Table from "../../components/Table";
import { FiEdit2, FiTrash2 } from "react-icons/fi";
import { BsSortDown } from "react-icons/bs";
import { BiRefresh } from "react-icons/bi";
import AdditionalItemModal from "../../components/Modal/AdditionalItemModal";
import SuccessDialog from "../../components/Dialog/SuccessDialog";
import Dialog from "../../components/Dialog/ConfirmDialog";
import FailedDialog from "../../components/Dialog/FailedDialog";
import RefreshLoader from "../../components/Loading";
import axios from "axios";

const AdditionalItemManagementPage = () => {
  const [tableSearchQuery, setTableSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [sortOption, setSortOption] = useState("");

  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [isFailModalOpen, setIsFailModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  const [mode, setMode] = useState("add");
  const [actionType, setActionType] = useState("");
  const [items, setItems] = useState([]);

  const [dialogData, setDialogData] = useState({ title: "", message: "" });
  const [loading, setLoading] = useState(false);

  const handleDeleteFilter = () => {
    setTableSearchQuery("");
  };

  const fetchItems = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        "http://localhost:8000/api/additional-items"
      );
      setItems(response.data.data); // Lưu dữ liệu vào state
    } catch (error) {
      console.error("Error fetching items:", error);
    } finally {
      setLoading(false); // End loading when API call is complete
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
    setLoading(true);
    try {
      if (actionType === "delete") {
        await axios.delete(
          `http://localhost:8000/api/additional-items/${selectedItem._id}`
        );
        const updatedFilteredData = items.filter((item) =>
          item.name.toLowerCase().includes(tableSearchQuery.toLowerCase())
        );
        const newTotalPages = Math.ceil(
          updatedFilteredData.length / itemsPerPage
        );

        // Kiểm tra nếu trang hiện tại không còn dữ liệu, chuyển về trang trước
        if (newTotalPages < currentPage && newTotalPages > 0) {
          setCurrentPage(newTotalPages); // Quay về trang trước nếu trang hiện tại không còn dữ liệu
        } else {
          setCurrentPage(currentPage - 1); // Giữ nguyên trang hiện tại nếu còn dữ liệu
        }
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
      alert("Thao tác thất bại, lỗi: " + error.response.data.msg);
    } finally {
      setTimeout(() => {
        setLoading(false);
      }, 2000);
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
    { header: "Điểm tích lũy (%)", key: "loyalPointRate" },
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

  const filteredData = useMemo(() => {
    // Lọc dữ liệu theo tên sản phẩm
    let filtered = items.filter((item) =>
      item.name.toLowerCase().includes(tableSearchQuery.toLowerCase())
    );

    // Sắp xếp dữ liệu sau khi lọc
    if (sortOption === "Asc") {
      console.log("Sắp xếp giá tăng dần");
      filtered = filtered.sort((a, b) => a.price - b.price); // Sắp xếp giá tăng dần
    } else if (sortOption === "Des") {
      console.log("Sắp xếp giá giảm dần");
      filtered = filtered.sort((a, b) => b.price - a.price); // Sắp xếp giá giảm dần
    }

    return filtered;
  }, [items, tableSearchQuery, sortOption]);

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
            <h1 className="text-xl font-bold text-gray-800 ">Lọc:</h1>
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
          <div className="flex items-center gap-4 ml-20">
            <span className="text-xl font-bold text-gray-800">Sắp xếp:</span>
            <div className="relative inline-block w-64">
              <select
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value)}
                className="block appearance-none w-full bg-white border border-gray-300 hover:border-gray-400 px-4 py-2 pr-8 rounded-lg leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Không sắp xếp</option>
                <option value="Asc">Tăng dần giá</option>
                <option value="Des">Giảm dần giá</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                <BsSortDown className="h-4 w-4" />
              </div>
            </div>
          </div>
        </div>
        <div>
          <button
            className="mr-10 px-4 py-2 text-gray-600 bg-gray-300 rounded-lg hover:bg-gray-400"
            onClick={() => handleDeleteFilter()}
          >
            Xóa lọc
          </button>
          <button
            className="px-4 py-2 bg-black text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
            onClick={() => handleAddClick()}
          >
            Thêm sản phẩm +
          </button>
        </div>
      </div>
      <div className="bg-white rounded-lg shadow-sm overflow-x-auto">
        <Table columns={columns} data={paginatedData} />
        {items.length > 0 && (
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
      <AdditionalItemModal
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
        onClose={() => {
          setIsDetailModalOpen(false);
          setIsSuccessModalOpen(false);
        }}
      />
      <FailedDialog
        isOpen={isFailModalOpen}
        title={dialogData.title}
        message={dialogData.message}
        onClose={() => {
          setIsFailModalOpen(false);
        }}
      />
      <RefreshLoader isOpen={loading} />
    </div>
  );
};

export default AdditionalItemManagementPage;

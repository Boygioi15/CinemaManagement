import { useState, useEffect } from "react";
import RuleTable from "../../components/Rule/table";
import { FiEdit2, FiTrash2 } from "react-icons/fi";
import { BiRefresh } from "react-icons/bi";
import RefreshLoader from "../../components/Loading";
import axios from "axios";
import Dialog from "../../components/ConfirmDialog";
import SuccessDialog from "../../components/SuccessDialog";
import FailedDialog from "../../components/FailedDialog";
import TicketTypeModal from "../../components/AnotherRule/TicketTypeModal";
import EmployeeAccount from "../../components/AnotherRule/EmployeeAcount";
import TagModal from "../../components/AnotherRule/TagModal";

const AnotherRule = () => {
  const [tags, setTags] = useState([]);
  const [ticketTypes, setTicketTypes] = useState([]);
  const [accounts, setAccounts] = useState([]);

  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState("add");

  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [isFailModalOpen, setIsFailModalOpen] = useState(false);

  const [dialogData, setDialogData] = useState({ title: "", message: "" });
  const [selectedItem, setSelectedItem] = useState(null);
  const [currentPage, setCurrentPage] = useState(1); // Lưu trang hiện tại của bảng
  const itemsPerPage = 5;

  const fetchTicketTypes = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8000/api/param/ticket-type"
      );
      setTicketTypes(response.data.data);
    } catch (error) {
      console.error("Error fetching items:", error);
    }
  };

  const ticketTypeColumns = [
    { header: "Tên loại vé", key: "title" },
    { header: "Giá", key: "price" },
    { header: "Điểm tích lũy (%)", key: "loyalPointRate" },
    {
      header: "Ghế Đôi",
      key: "isPair",
      render: (value) => (value ? "Có" : "Không"),
    },
    {
      header: "Hành động",
      key: "actions",
      render: (_, row) => (
        <div className="flex space-x-3">
          <button
            className="text-blue-600 hover:text-blue-800"
            onClick={() => handleTicketTypeClick(row)}
          >
            <FiEdit2 className="w-4 h-4" />
          </button>
          <button
            className="text-red-600 hover:text-red-800"
            onClick={() => handleDeleteType(row)}
          >
            <FiTrash2 className="w-4 h-4" />
          </button>
        </div>
      ),
    },
  ];

  const fetchTags = async () => {
    try {
      const response = await axios.get("http://localhost:8000/api/tags");
      setTags(response.data.data);
    } catch (error) {
      console.error("Error fetching items:", error);
    }
  };

  // Gọi API khi component được render lần đầu

  const typeColumns = [
    { header: "Tên thể loại", key: "name" },
    {
      header: "Hành động",
      key: "actions",
      render: (_, row) => (
        <div className="flex space-x-3">
          <button
            className="text-red-600 hover:text-red-800"
            onClick={() => handleDeleteTag(row)}
          >
            <FiTrash2 className="w-4 h-4" />
          </button>
        </div>
      ),
    },
  ];
  const fetchAccount = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8000/api/user/employee/all-account"
      );
      setAccounts(response.data.data);
    } catch (error) {
      console.error("Error fetching items:", error);
    }
  };

  const Accountcolumns = [
    { header: "Tên nhân viên", key: "name" },
    { header: "Công việc", key: "jobTitle" },
    { header: "Số điện thoại", key: "phone" },
    {
      header: "Hành động",
      key: "actions",
      render: (_, row) => (
        <div className="flex space-x-3">
          <button
            className="text-red-600 hover:text-red-800"
            onClick={() => handleDeleteAccount(row)}
          >
            <FiTrash2 className="w-4 h-4" />
          </button>
        </div>
      ),
    },
  ];

  const handleRefresh = async () => {
    setLoading(true);
    fetchTags();
    fetchTicketTypes();
    fetchAccount();
    setTimeout(() => {
      setLoading(false);
    }, 2000);
  };

  useEffect(() => {
    fetchTags();
    fetchTicketTypes();
    fetchAccount();
  }, []);
  const [activeModal, setActiveModal] = useState(""); // Xác định modal đang mở

  const handleTicketTypeClick = (type) => {
    setSelectedItem(type);
    setMode("edit");
    setActiveModal("Loại vé");

    // Đặt tên modal đang mở
  };

  // Xử lý mở modal cho từng bảng
  const handleAddNew = (tableTitle) => {
    setActiveModal(tableTitle);
    setMode("add");
    console.log(tableTitle);
    // Đặt tên modal đang mở
  };

  const handleCloseModal = () => {
    setActiveModal(""); // Đóng modal
  };

  //xóa loại vé
  const handleDeleteType = async (data) => {
    setSelectedItem(data);
    setActiveModal("Xóa loại vé");
    setMode("delete"); // Chế độ xóa
    setDialogData({
      title: "Xóa loại vé",
      message: "Bạn có chắc chắn muốn xóa loại vé này?",
    });
    setIsConfirmModalOpen(true); // Hiển thị modal xác nhận
  };

  //Xóa thể loại phim
  const handleDeleteTag = async (data) => {
    setSelectedItem(data);
    setActiveModal("Xóa thể loại phim");
    setMode("delete"); // Chế độ xóa
    setDialogData({
      title: "Xóa thể loại phim",
      message: "Bạn có chắc chắn muốn xóa thể loại phim này?",
    });
    setIsConfirmModalOpen(true); // Hiển thị modal xác nhận
  };

  //Xóa tìa khoản
  const handleDeleteAccount = async (data) => {
    setSelectedItem(data);
    setActiveModal("Xóa tài khoản");
    setMode("delete"); // Chế độ xóa
    setDialogData({
      title: "Xóa tài khoản",
      message: "Bạn có chắc chắn muốn xóa tài khoản này?",
    });
    setIsConfirmModalOpen(true); // Hiển thị modal xác nhận
  };

  // Xử lý lưu dữ liệu cho từng modal
  const handleConfirmClick = async () => {
    setIsConfirmModalOpen(false);
    try {
      if (activeModal === "Loại vé") {
        if (mode === "edit") {
          await axios.patch(
            `http://localhost:8000/api/param/ticket-type/${selectedItem._id}`,
            selectedItem
          );
          console.log("data: ", selectedItem);

          setDialogData({
            title: "Cập nhật thành công",
            message: `Loại vé đã được cập nhật thành công.`,
          });
        } else {
          const itemToSend = { ...selectedItem };
          delete itemToSend._id; // Loại bỏ _id nếu có
          // Logic cho "add"
          await axios.post(
            "http://localhost:8000/api/param/ticket-type",
            itemToSend
          );
          setDialogData({
            title: "Thêm mới thành công",
            message: `Loại vé mới đã được thêm thành công.`,
          });
        }
      } else if (activeModal === "Thể loại phim") {
        await axios.post("http://localhost:8000/api/tags", selectedItem);
        // Logic cho "add" thể loại phim
        setDialogData({
          title: "Thêm mới thành công",
          message: `Thể loại phim mới đã được thêm thành công.`,
        });
      } else if (activeModal === "Tài khoản") {
        {
          console.log(selectedItem);
          const id = selectedItem.name;
          const requestData = {
            account: selectedItem.username,
            password: selectedItem.password,
          };

          // Gửi yêu cầu đến API
          await axios.post(
            `http://localhost:8000/api/user/employee/update-account/${id}`, // name được truyền vào param
            requestData // Dữ liệu body
          );

          // Logic cho "add" tài khoản
          setDialogData({
            title: "Thêm mới thành công",
            message: `Tài khoản mới đã được thêm thành công.`,
          });
        }
      } else if (activeModal === "Xóa loại vé") {
        await axios.delete(
          `http://localhost:8000/api/param/ticket-type/${selectedItem._id}`
        );
        setDialogData({
          title: "Thành công",
          message: "Xóa loại vé thành công",
        });
        setTicketTypes((prev) => {
          const updatedList = prev.filter(
            (item) => item._id !== selectedItem._id
          );

          // Kiểm tra nếu hiện tại không có đủ item cho trang hiện tại
          const totalPages = Math.ceil(updatedList.length / itemsPerPage);
          if (currentPage > totalPages && totalPages > 0) {
            // Nếu trang hiện tại không có dữ liệu, lùi lại 1 trang
            setCurrentPage(totalPages);
          } else if (updatedList.length === 0) {
            // Nếu không còn dữ liệu, quay lại trang 1
            setCurrentPage(1);
          }

          return updatedList;
        });
      } else if (activeModal === "Xóa thể loại phim") {
        await axios.delete(
          `http://localhost:8000/api/tags/${selectedItem._id}`
        );
        setDialogData({
          title: "Thành công",
          message: "Xóa thể loại phim thành công",
        });
        setTags((prev) => {
          const updatedList = prev.filter(
            (item) => item._id !== selectedItem._id
          );

          // Kiểm tra nếu hiện tại không có đủ item cho trang hiện tại
          const totalPages = Math.ceil(updatedList.length / itemsPerPage);
          if (currentPage > totalPages && totalPages > 0) {
            // Nếu trang hiện tại không có dữ liệu, lùi lại 1 trang
            setCurrentPage(totalPages);
          } else if (updatedList.length === 0) {
            // Nếu không còn dữ liệu, quay lại trang 1
            setCurrentPage(1);
          }

          return updatedList;
        });
      } else if (activeModal === "Xóa tài khoản") {
        await axios.delete(
          `http://localhost:8000/api/user/employee/delete-account/${selectedItem._id}`
        );
        setDialogData({
          title: "Thành công",
          message: "Xóa tài khoản thành công",
        });
        setTags((prev) => {
          const updatedList = prev.filter(
            (item) => item._id !== selectedItem._id
          );

          // Kiểm tra nếu hiện tại không có đủ item cho trang hiện tại
          const totalPages = Math.ceil(updatedList.length / itemsPerPage);
          if (currentPage > totalPages && totalPages > 0) {
            // Nếu trang hiện tại không có dữ liệu, lùi lại 1 trang
            setCurrentPage(totalPages);
          } else if (updatedList.length === 0) {
            // Nếu không còn dữ liệu, quay lại trang 1
            setCurrentPage(1);
          }

          return updatedList;
        });
      }

      await handleRefresh();
      handleCloseModal();
      setIsSuccessModalOpen(true);
    } catch (error) {
      console.log(error);

      setDialogData({
        title: "Thất bại",
        message: "Đã xảy ra lỗi khi thực hiện hành động. Vui lòng thử lại.",
      });
      setIsFailModalOpen(true);
    }
  };

  const handleEditConfirm = (item) => {
    setSelectedItem(item);

    console.log(mode);

    // Xác định loại hành động dựa trên chế độ hiện tại
    const action = mode === "add" ? "thêm mới" : "cập nhật";
    // Xác định bảng nào đang thao tác
    let tableName = activeModal;

    // Cập nhật dữ liệu dialog theo bảng
    if (tableName === "Loại vé") {
      setDialogData({
        title: mode === "edit" ? "Chỉnh sửa loại vé" : "Thêm mới loại vé",
        message:
          mode === "edit"
            ? "Bạn có chắc chắn muốn chỉnh sửa loại vé này?"
            : "Bạn có muốn thêm loại vé mới?",
      });
    } else if (tableName === "Thể loại phim") {
      setDialogData({
        title:
          mode === "edit"
            ? "Chỉnh sửa thể loại phim"
            : "Thêm mới thể loại phim",
        message:
          mode === "edit"
            ? "Bạn có chắc chắn muốn chỉnh sửa thể loại phim này?"
            : "Bạn có muốn thêm thể loại phim mới?",
      });
    } else if (tableName === "Tài khoản") {
      setDialogData({
        title: mode === "edit" ? "Chỉnh sửa tài khoản" : "Thêm mới tài khoản",
        message:
          mode === "edit"
            ? "Bạn có chắc chắn muốn chỉnh sửa tài khoản này?"
            : "Bạn có muốn thêm tài khoản mới?",
      });
    }

    // Gọi dialog xác nhận với loại hành động tương ứng
    setIsConfirmModalOpen(true);
  };

  const openConfirmDialog = (action, item) => {
    setIsConfirmModalOpen(true);
  };

  //xử lí giá vé chi lưu khi thay đổi giá
  const [prices, setPrices] = useState({
    vip: 10000,
    center: 10000,
  });
  const [originalPrices] = useState({ ...prices }); // Lưu giá trị ban đầu để so sánh

  // Hàm cập nhật giá trị khi nhập liệu
  const handleChange = (type, value) => {
    setPrices({ ...prices, [type]: value });
  };

  // Hàm kiểm tra trạng thái nút "Lưu"
  const isChanged = (type) => {
    return prices[type] !== originalPrices[type];
  };

  //Hàm xử lý khi nhấn "Lưu"
  const handleSavePrice = (type) => {
    console.log(`Giá vé ${type} đã lưu: ${prices[type]} VNĐ`);
    // Thực hiện gọi API lưu dữ liệu tại đây
  };

  return (
    <div className="container mx-auto p-6 bg-gray-50 min-h-screen">
      <div className="mb-6 flex justify-between items-center pr-10">
        <div className="flex items-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Thay đổi các quy định
          </h2>
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
        </div>
      </div>
      <div className="flex flex-col gap-6">
        <RuleTable
          title="Loại vé"
          data={ticketTypes}
          columns={ticketTypeColumns}
          onAddNew={handleAddNew}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
        />
        <RuleTable
          title="Thể loại phim"
          data={tags}
          columns={typeColumns}
          onAddNew={handleAddNew}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
        />
        <RuleTable
          title="Tài khoản"
          data={accounts}
          columns={Accountcolumns}
          onAddNew={handleAddNew}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
        />
      </div>

      <div className="p-6 bg-white rounded-lg  max-w-lg">
        <h2 className="text-xl font-bold mb-4">Các số liệu khác</h2>

        <div className="space-y-4">
          {/* Giá vé cho ghế VIP */}
          <div className="flex items-center space-x-2">
            <label className="text-sm font-medium">
              Giá vé thêm cho ghế VIP:
            </label>
            <input
              type="number"
              value={prices.vip}
              onChange={(e) => handleChange("vip", parseInt(e.target.value))}
              className="border px-2 py-1 rounded w-24"
            />
            <span>VNĐ</span>
            <button
              onClick={() => handleSavePrice("vip")}
              disabled={!isChanged("vip")}
              className={`px-4 py-2 rounded text-white ${
                isChanged("vip")
                  ? "bg-black hover:bg-gray-800"
                  : "bg-gray-400 cursor-not-allowed"
              }`}
            >
              Lưu
            </button>
          </div>

          {/* Giá vé cho ghế trung tâm */}
          <div className="flex items-center space-x-2">
            <label className="text-sm font-medium">
              Giá vé thêm cho ghế trung tâm:
            </label>
            <input
              type="number"
              value={prices.center}
              onChange={(e) => handleChange("center", parseInt(e.target.value))}
              className="border px-2 py-1 rounded w-24"
            />
            <span>VNĐ</span>
            <button
              onClick={() => handleSavePrice("center")}
              disabled={!isChanged("center")}
              className={`px-4 py-2 rounded text-white ${
                isChanged("center")
                  ? "bg-black hover:bg-gray-800"
                  : "bg-gray-400 cursor-not-allowed"
              }`}
            >
              Lưu
            </button>
          </div>
        </div>
      </div>

      {/* Modal cho từng bảng */}
      {activeModal === "Loại vé" && (
        <TicketTypeModal
          isOpen={true}
          onClose={handleCloseModal}
          onSave={handleEditConfirm}
          type={selectedItem}
          mode={mode}
        />
      )}
      {activeModal === "Thể loại phim" && (
        <TagModal
          isOpen={true}
          onClose={handleCloseModal}
          onSave={handleEditConfirm}
        />
      )}
      {activeModal === "Tài khoản" && (
        <EmployeeAccount
          isOpen={true}
          onClose={handleCloseModal}
          onSave={handleEditConfirm}
          type={selectedItem}
          mode={mode}
        />
      )}
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

export default AnotherRule;

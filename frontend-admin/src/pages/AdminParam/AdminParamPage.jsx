import { useState, useEffect } from "react";
import RuleTable from "../../components/Rule/table";
import { FiEdit2, FiTrash2 } from "react-icons/fi";
import { BiRefresh } from "react-icons/bi";
import RefreshLoader from "../../components/Loading";
import axios from "axios";
import Dialog from "../../components/Dialog/ConfirmDialog";
import SuccessDialog from "../../components/Dialog/SuccessDialog";
import FailedDialog from "../../components/Dialog/FailedDialog";
import TicketTypeModal from "../../components/Modal/TicketTypeModal";
import EmployeeAccount from "../../components/Modal/EmployeeAcountModal";
import TagModal from "../../components/Modal/TagModal";

const AdminParamPage = () => {
  const [tags, setTags] = useState([]);
  const [ticketTypes, setTicketTypes] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const [type, setType] = useState("");

  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState("add");

  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [isFailModalOpen, setIsFailModalOpen] = useState(false);

  const [dialogData, setDialogData] = useState({ title: "", message: "" });
  const [selectedItem, setSelectedItem] = useState(null);

  const [params, setParams] = useState({
    addedPriceForVIPSeat: 0,
    maximumDiscountRate: 0,
    loyalPoint_MaxiumPointUseInOneGo: 0,
    loyalPoint_MiniumValueToUseLoyalPoint: 0,
    loyalPoint_PointToReducedPriceRatio: 0,
    loyalPoint_OrderToPointRatio: 0,
  });

  const [originalPrices, setOriginalPrices] = useState({});
  // const [currentPage, setCurrentPage] = useState(1); // Lưu trang hiện tại của bảng
  const [currentPage, setCurrentPage] = useState({
    ticketTypes: 1,
    tags: 1,
    accounts: 1,
  });
  const itemsPerPage = 5;
  const handlePageChange = (tableName, pageNumber) => {
    setCurrentPage((prevPage) => ({
      ...prevPage,
      [tableName]: pageNumber,
    }));
  };

  const fetchTicketTypes = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        "http://localhost:8000/api/param/ticket-type"
      );
      setTicketTypes(response.data.data);
    } catch (error) {
      console.error("Error fetching items:", error);
    } finally {
      setLoading(false); // End loading when API call is complete
    }
  };

  const ticketTypeColumns = [
    { header: "Tên loại vé", key: "title" },
    {
      header: "Giá",
      key: "price",
      render: (_, row) => row.price.toLocaleString(),
    },
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

  const fetchParam = async () => {
    try {
      const response = await axios.get("http://localhost:8000/api/param");
      setParams(response.data.data);
      setOriginalPrices(response.data.data);
    } catch (error) {
      console.error("Error fetching items:", error);
    }
  };

  const handleRefresh = async () => {
    setLoading(true);
    fetchTags();
    fetchTicketTypes();
    fetchAccount();
    fetchParam();
    setTimeout(() => {
      setLoading(false);
    }, 2000);
  };

  useEffect(() => {
    fetchTags();
    fetchTicketTypes();
    fetchAccount();
    fetchParam();
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
      if (activeModal === "Lưu quy định") {
        // Nếu là thao tác lưu quy định
        //setIsUpdatingConfig(true); // Đánh dấu thao tác lưu quy định
        // Logic lưu quy định
        const response = await axios.put(
          "http://localhost:8000/api/param",
          params
        );
        if (response.status === 200) {
          setOriginalPrices((prevPrices) => ({
            ...prevPrices,
            [type]: params[type],
          }));
        }

        setDialogData({
          title: "Cập nhật thành công",
          message: "Quy định đã được cập nhật thành công.",
        });
        setIsSuccessModalOpen(true); // Hiển thị modal thành công
      } else {
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
            if (currentPage.ticketTypes > totalPages && totalPages > 0) {
              // Nếu trang hiện tại không có dữ liệu, lùi lại 1 trang
              setCurrentPage((prev) => ({ ...prev, ticketTypes: totalPages }));
            } else if (updatedList.length === 0) {
              // Nếu không còn dữ liệu, quay lại trang 1
              setCurrentPage((prev) => ({ ...prev, ticketTypes: 1 }));
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

            const totalPages = Math.ceil(updatedList.length / itemsPerPage);
            if (currentPage.tags > totalPages && totalPages > 0) {
              // Nếu trang hiện tại không có dữ liệu, lùi lại 1 trang
              setCurrentPage((prev) => ({ ...prev, tags: totalPages }));
            } else if (updatedList.length === 0) {
              // Nếu không còn dữ liệu, quay lại trang 1
              setCurrentPage((prev) => ({ ...prev, tags: 1 }));
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
            if (currentPage.accounts > totalPages && totalPages > 0) {
              // Nếu trang hiện tại không có dữ liệu, lùi lại 1 trang
              setCurrentPage((prev) => ({ ...prev, accounts: totalPages }));
            } else if (updatedList.length === 0) {
              // Nếu không còn dữ liệu, quay lại trang 1
              setCurrentPage((prev) => ({ ...prev, accounts: 1 }));
            }

            return updatedList;
          });
        }
      }
      await handleRefresh();
      handleCloseModal();
      setIsSuccessModalOpen(true);
    } catch (error) {
      console.log(error);
      const errorMsg = error.response
        ? error.response.data.msg
        : "Đã xảy ra lỗi, vui lòng thử lại.";
      alert("Thao tác thất bại, lỗi: " + errorMsg);
      //setIsFailModalOpen(true);
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

  console.log(originalPrices);

  // Hàm cập nhật giá trị khi nhập liệu
  const handleChange = (type, value) => {
    setParams((prevPrices) => ({
      ...prevPrices,
      [type]: value,
    }));
  };

  // Hàm kiểm tra trạng thái nút "Lưu"
  const isChanged = (type) => {
    const currentValue = params[type];
    const originalValue = originalPrices[type];

    // Kiểm tra nếu cả hai giá trị đều là số và so sánh chúng
    return (
      currentValue !== undefined &&
      originalValue !== undefined &&
      currentValue !== originalValue
    );
  };

  //Hàm xử lý khi nhấn "Lưu"

  const handleSavePrice = (type) => {
    setType(type);
    setActiveModal("Lưu quy định"); // Đặt modal hiện tại là "Lưu quy định"
    setDialogData({
      title: "Xác nhận lưu thay đổi",
      message: "Bạn có muốn lưu các thay đổi quy định không?",
    });
    setIsConfirmModalOpen(true);
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
        {ticketTypes.length > 0 ? (
          <RuleTable
            title="Loại vé"
            data={ticketTypes}
            columns={ticketTypeColumns}
            onAddNew={handleAddNew}
            currentPage={currentPage.ticketTypes}
            setCurrentPage={(pageNumber) =>
              handlePageChange("ticketTypes", pageNumber)
            }
          />
        ) : (
          <p className="text-center text-gray-500 py-4">Không có dữ liệu</p>
        )}

        {tags.length > 0 ? (
          <RuleTable
            title="Thể loại phim"
            data={tags}
            columns={typeColumns}
            onAddNew={handleAddNew}
            currentPage={currentPage.tags}
            setCurrentPage={(pageNumber) =>
              handlePageChange("tags", pageNumber)
            }
          />
        ) : (
          <p className="text-center text-gray-500 py-4">Không có dữ liệu</p>
        )}

        {accounts.length > 0 ? (
          <RuleTable
            title="Tài khoản"
            data={accounts}
            columns={Accountcolumns}
            onAddNew={handleAddNew}
            currentPage={currentPage.accounts}
            setCurrentPage={(pageNumber) =>
              handlePageChange("accounts", pageNumber)
            }
          />
        ) : (
          <p className="text-center text-gray-500 py-4">Không có dữ liệu</p>
        )}
      </div>

      <div className="p-6 bg-white rounded-lg  max-w-4xl">
        <h2 className="text-xl font-bold mb-4">Các số liệu khác</h2>

        <table className="w-full border-collapse border border-gray-200">
          <tbody>
            {/* Giá vé cho ghế VIP */}

            {/* Các mục còn lại */}
            {[
              {
                label: "Giá vé thêm cho ghế VIP:",
                key: "addedPriceForVIPSeat",
                unit: "VNĐ",
              },
              {
                label: " Mức giảm giá tối đa cho chương trình khuyến mãi:",
                key: "maximumDiscountRate",
                unit: "%",
              },
              {
                label: "Điểm sử dụng tối đa trong 1 lần:",
                key: "loyalPoint_MaxiumPointUseInOneGo",
                unit: "",
              },
              {
                label: "Giá trị hóa đơn tối thiểu để sử dụng điểm:",
                key: "loyalPoint_MiniumValueToUseLoyalPoint",
                unit: "VNĐ",
              },
              {
                label: "Tỷ lệ quy đổi từ điểm sang giảm hóa đơn:",
                key: "loyalPoint_PointToReducedPriceRatio",
                unit: "%",
              },
              {
                label: "Tỷ lệ quy đổi từ giá trị hóa đơn sang điểm:",
                key: "loyalPoint_OrderToPointRatio",
                unit: "%",
              },
            ].map((item, index) => (
              <tr key={index} className="border-b">
                <td className="p-2 text-sm font-medium">{item.label}</td>
                <td className="p-2 flex items-center space-x-2">
                  <input
                    type="number"
                    value={params[item.key]}
                    onChange={(e) =>
                      handleChange(`${item.key}`, parseInt(e.target.value))
                    }
                    className="border px-2 py-1 rounded w-52"
                  />
                  {item.unit && <span>{item.unit}</span>}
                </td>
                <td className="p-2">
                  <button
                    onClick={() => handleSavePrice(`${item.key}`)}
                    disabled={!isChanged(`${item.key}`)}
                    className={`px-4 py-2 rounded text-white ${
                      isChanged(`${item.key}`)
                        ? "bg-black hover:bg-gray-800"
                        : "bg-gray-400 cursor-not-allowed"
                    }`}
                  >
                    Lưu
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <span className="ml-6 block text-lg text-gray-600 leading-relaxed">
        Ví dụ về tỷ lệ đổi điểm:
        <br />- Với tỉ lệ đổi từ giá trị hóa đơn sang điểm = <b>3%</b>: 100,000
        VNĐ → <b>3,000 điểm</b> (lấy giá trị thật).
        <br />- Với tỉ lệ đổi từ điểm sang giảm giá trị hóa đơn = <b>50%</b>:
        <b>3,000 điểm</b> → giảm được <b>1,500 VNĐ</b>.
      </span>
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

export default AdminParamPage;

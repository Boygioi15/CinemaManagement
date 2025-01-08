import React from "react";
import Table from "../../components/Table";
import { FiEdit2 } from "react-icons/fi";
import { TbCancel } from "react-icons/tb";
import { BiRefresh } from "react-icons/bi";
import { useState, useEffect, useMemo } from "react";
import { BsSortDown } from "react-icons/bs";
import { VscDebugContinue, VscDebugPause } from "react-icons/vsc";
import axios from "axios";
import Dialog from "../../components/Dialog/ConfirmDialog";
import SuccessDialog from "../../components/Dialog/SuccessDialog";
import RefreshLoader from "../../components/Loading";
import FailedDialog from "../../components/Dialog/FailedDialog";
import PromotionModal from "../../components/Modal/PromotionModal";

const PromotionManagementPage = () => {
  const [promotions, setPromotions] = useState([]);
  const [mode, setMode] = useState("add");
  const [actionType, setActionType] = useState("");
  const [sortOption, setSortOption] = useState("");

  const [NameQuery, setNameQuery] = useState("");
  const [statusQuery, setStatusQuery] = useState("");
  const [selectedDate, setSelectedDate] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [selectedPromotion, setSelectedPromotion] = useState(null);

  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [isFailModalOpen, setIsFailModalOpen] = useState(false);

  const [dialogData, setDialogData] = useState({ title: "", message: "" });
  const [loading, setLoading] = useState(false);

  const handleDeleteFilter = () => {
    setNameQuery("");
    setStatusQuery("");
    setSelectedDate("");
  };

  const fetchPromotion = async () => {
    try {
      setLoading(true);
      const response = await axios.get("http://localhost:8000/api/promotion");
      const processedData = response.data.data.map((item) => ({
        ...item,
        status: getStatus(item.paused, item.beginDate, item.endDate), // Tính trạng thái
      }));
      setPromotions(processedData); // Lưu dữ liệu vào state
    } catch (error) {
      console.error("Error fetching films:", error);
    } finally {
      setLoading(false); // End loading when API call is complete
    }
  };

  // Gọi API khi component được render lần đầu
  useEffect(() => {
    fetchPromotion();
  }, []);

  const openConfirmDialog = (action, item = null) => {
    setActionType(action); // Xác định loại hành động
    setSelectedPromotion(item); // Gán item được chọn nếu có
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
        if (item.paused) {
          return `Bạn chắc chắn muốn tiếp tục sự kiện này?`; // Nếu sự kiện đã tạm ngưng, hiển thị thông báo tiếp tục
        }
        return `Bạn chắc chắn muốn tạm ngưng sự kiện này?`; // Nếu sự kiện chưa tạm ngưng, hiển thị thông báo tạm ngưng
      case "add":
        return "Bạn chắc chắn muốn thêm sự kiện này ?";
      case "edit":
        return `Bạn chắc chắn muốn cập nhật sự kiện này ?`;
      default:
        return "Xác nhận hành động?";
    }
  };

  //lấy message thành công
  const getSuccessMessage = (action, item = null) => {
    switch (action) {
      case "delete":
        if (item && item.paused) {
          return "Tiếp tục sự kiện thành công"; // Nếu sự kiện đã tạm ngưng và người dùng tiếp tục
        }
        return "Tạm ngưng sự kiện thành công"; // Nếu sự kiện chưa tạm ngưng
      case "add":
        return "Thêm sự kiện thành công";
      case "edit":
        return "Cập nhật sự kiện thành công";
      default:
        return "Thao tác thành công";
    }
  };

  //Chọn cập nhật item
  const handleEditClick = (item) => {
    setSelectedPromotion(item);
    setMode("edit");
    setIsDetailModalOpen(true);
  };

  //thêm mới item
  const handleAddClick = () => {
    setMode("add");
    setSelectedPromotion(null);
    setIsDetailModalOpen(true);
  };

  //chọn xóa item
  const handleDelete = (item) => {
    openConfirmDialog("delete", item);
  };

  const handleConfirmClick = async () => {
    setLoading(true);

    try {
      if (actionType === "delete") {
        if (selectedPromotion.paused) {
          // Nếu sự kiện đã tạm ngưng, thực hiện tiếp tục sự kiện
          await axios.patch(
            `http://localhost:8000/api/promotion/${selectedPromotion._id}/resume`
          );
        } else {
          // Nếu sự kiện chưa tạm ngưng, thực hiện xóa
          await axios.patch(
            `http://localhost:8000/api/promotion/${selectedPromotion._id}/pause`
          );
        }
      } else if (actionType === "edit") {
        const res = await axios.put(
          `http://localhost:8000/api/promotion/${selectedPromotion._id}`,
          selectedPromotion
        );
      } else if (actionType === "add") {
        console.log("haha: ", selectedPromotion);
        const formData = new FormData();
        formData.append("name", selectedPromotion.name);
        formData.append("discountRate", selectedPromotion.discountRate);
        formData.append("beginDate", selectedPromotion.beginDate);
        formData.append("endDate", selectedPromotion.endDate);
        formData.append("thumbnailFile", selectedPromotion.thumbnailFile);
        formData.append("thumbnailURL", selectedPromotion.thumbnailURL || "");
        console.log(selectedPromotion);
        await axios.post("http://localhost:8000/api/promotion", formData);
      }
      await handleRefresh(); // Làm mới dữ liệu sau khi thành công
      // Hiển thị thông báo thành công
      setDialogData({
        title: "Thành công",
        message: getSuccessMessage(actionType, selectedPromotion),
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
    setSelectedPromotion(item);
    console.log("item: ", item);

    // Xác định loại hành động dựa trên chế độ hiện tại
    const action = mode === "add" ? "add" : "edit";

    // Gọi dialog xác nhận với loại hành động tương ứng
    openConfirmDialog(action, item);
  };

  const formatDate = (dateString) => {
    if (!dateString) return ""; // Kiểm tra nếu ngày không tồn tại
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Tháng bắt đầu từ 0
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const getStatus = (paused, beginDate, endDate) => {
    if (paused) return "Đã ngừng";

    const today = new Date();
    const begin = new Date(beginDate);
    const end = new Date(endDate);

    if (today < begin) return "Chưa bắt đầu";
    if (today > end) return "Đã kết thúc";
    return "Đang diễn ra";
  };

  const columns = [
    { header: "Tên sự kiện", key: "name" },
    { header: "Khuyến mãi (%)", key: "discountRate" },
    {
      header: "Ngày bắt đầu",
      key: "beginDate",
      render: (_, row) => formatDate(row.beginDate),
    },
    {
      header: "Ngày kết thúc",
      key: "endDate",
      render: (_, row) => formatDate(row.endDate),
    },
    {
      header: "Trạng thái",
      key: "status",
      render: (_, row) => {
        let statusClass = "";
        let statusText = row.status; // Đảm bảo `rowData.status` có giá trị hợp lệ

        // Kiểm tra giá trị status và gán class tương ứng
        switch (row.status) {
          case "Chưa bắt đầu":
            statusClass = "bg-yellow-100 text-yellow-800"; // Màu vàng
            break;
          case "Đã ngừng":
            statusClass = "bg-red-100 text-red-800"; // Màu đỏ
            break;
          case "Đã kết thúc":
            statusClass = "bg-green-100 text-green-800"; // Màu xanh
            break;
          case "Đang diễn ra":
            statusClass = "bg-blue-100 text-blue-800"; // Màu xanh dương
            break;
          default:
            statusClass = "bg-gray-100 text-gray-800"; // Màu mặc định
            break;
        }

        return (
          <span
            className={`inline-block px-3 py-1 rounded-full ${statusClass}`}
          >
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
          <button
            className="text-red-600 hover:text-red-800"
            onClick={() => handleDelete(row)}
          >
            {row.paused ? (
              <VscDebugPause className="w-4 h-4" />
            ) : (
              <VscDebugContinue
                style={{ color: "green" }}
                className="w-4 h-4"
              />
            )}
          </button>
        </div>
      ),
    },
  ];

  const handleRefresh = async () => {
    setLoading(true);
    fetchPromotion();

    setTimeout(() => {
      setLoading(false);
    }, 2000);
  };

  const itemsPerPage = 7;

  const filteredData = useMemo(() => {
    // Lọc dữ liệu theo tên và chức vụ
    let filtered = promotions.filter((item) => {
      const matchesName = NameQuery
        ? item.name
            .toLowerCase()
            .normalize("NFC")
            .includes(NameQuery.toLowerCase().normalize("NFC"))
        : true;

      const matchesStatus =
        statusQuery === "" ||
        statusQuery === "all" ||
        item.status === statusQuery;

      const matchesDate =
        !selectedDate ||
        (new Date(item.beginDate) <= new Date(selectedDate) &&
          new Date(item.endDate) >= new Date(selectedDate));

      return matchesName && matchesStatus && matchesDate;
    });

    // Sắp xếp dữ liệu sau khi lọc

    if (sortOption === "BeginDateAsc") {
      console.log("Sắp xếp ngày bắt đầu từ cũ đến mới");
      filtered = filtered.sort(
        (a, b) => new Date(a.beginDate) - new Date(b.beginDate) // Từ cũ đến mới
      );
    } else if (sortOption === "BeginDateDes") {
      console.log("Sắp xếp ngày bắt đầu từ mới đến cũ");
      filtered = filtered.sort(
        (a, b) => new Date(b.beginDate) - new Date(a.beginDate) // Từ mới đến cũ
      );
    } else if (sortOption === "EndDateAsc") {
      console.log("Sắp xếp ngày kết thúc từ cũ đến mới");
      filtered = filtered.sort(
        (a, b) => new Date(a.endDate) - new Date(b.endDate) // Từ cũ đến mới
      );
    } else if (sortOption === "EndDateDes") {
      console.log("Sắp xếp ngày kết thúc từ mới đến cũ");
      filtered = filtered.sort(
        (a, b) => new Date(b.endDate) - new Date(a.endDate) // Từ mới đến cũ
      );
    }

    return filtered;
  }, [promotions, NameQuery, selectedDate, statusQuery, sortOption]);

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
            Thông tin sự kiện
          </h2>

          <div className="flex items-center gap-4 ">
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
                placeholder="Tên sự kiện...."
                value={NameQuery}
                onChange={(e) => setNameQuery(e.target.value)}
                className="w-full px-4 py-2 rounded-lg focus:outline-none border"
              />
            </div>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => {
                const localDate = e.target.value; // Lấy trực tiếp giá trị yyyy-mm-dd
                setSelectedDate(localDate); // Cập nhật state
              }}
              className="p-2 border rounded-md"
            />
            <div className="flex items-center w-[200px]">
              <select
                name="age"
                value={statusQuery}
                onChange={(e) => setStatusQuery(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="" disabled>
                  <span className="text-gray-400">Trạng thái</span>
                </option>
                <option value="all">Tất cả</option>
                <option value="Đã ngưng">Đã ngưng</option>
                <option value="Chưa bắt đầu">Chưa bắt đầu</option>
                <option value="Đang diễn ra">Đang diễn ra</option>
                <option value="Đã kết thúc">Đã kết thúc</option>
              </select>
            </div>
          </div>
          <div className="flex items-center gap-4 ml-20">
            <span className="text-xl font-bold text-gray-800 ">Sắp xếp:</span>
            <div className="relative inline-block w-64">
              <select
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value)}
                className="block appearance-none w-full bg-white border border-gray-300 hover:border-gray-400 px-4 py-2 pr-8 rounded-lg leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Không sắp xếp</option>
                <option value="BeginDateAsc">Ngày bắt đầu: Cũ đến mới</option>
                <option value="BeginDateDes">Ngày bắt đầu: Mới đến cũ</option>
                <option value="EndDateAsc">Ngày kết thúc: Cũ đến mới</option>
                <option value="EndDateDes">Ngày kết thúc: Mới đến cũ</option>
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
            Thêm sự kiện +
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm overflow-x-auto">
        <Table columns={columns} data={paginatedData} />

        {promotions.length > 0 && (
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

      <PromotionModal
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        onSave={handleEditConfirm}
        promotion={selectedPromotion}
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

export default PromotionManagementPage;

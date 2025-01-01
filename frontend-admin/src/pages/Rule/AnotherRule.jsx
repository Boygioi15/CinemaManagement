import { useState, useEffect } from "react";
import RuleTable from "../../components/Rule/table";
import { FiEdit2, FiTrash2 } from "react-icons/fi";
import axios from "axios";

const AnotherRule = () => {
  const [tags, setTags] = useState([]);

  const ticketTypeData = [
    { id: 1, title: "Người lớn", isPair: "Không", price: "70,000" },
    { id: 2, title: "HSSV, Người cao tuổi", isPair: "Không", price: "45,000" },
    { id: 3, title: "Người lớn", isPair: "Có", price: "145,000" },
    { id: 4, title: "Trẻ em", isPair: "Không", price: "40,000" },
    { id: 4, title: "Trẻ em", isPair: "Không", price: "40,000" },
    { id: 4, title: "Trẻ em", isPair: "Không", price: "40,000" },
  ];
  const ticketTypeColumns = [
    { header: "Tên loại vé", key: "title" },
    { header: "Giá", key: "price" },
    { header: "Đôi", key: "isPair" },
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
  const AccountData = [
    { id: 1, name: "Đạt", userName: "irisus", units: 230 },
    { id: 2, name: "Điền", userName: "irisus", units: 185 },
    { id: 3, name: "Quyền", userName: "irisus", units: 275 },
    { id: 4, name: "Phong", userName: "irisus", units: 210 },
    { id: 5, name: "Thịnh", userName: "irisus", units: 245 },
    { id: 6, name: "Test", userName: "irisus", units: 195 },
  ];
  const Accountcolumns = [
    { header: "Tên nhân viên", key: "name" },
    { header: "Tên tài khoản", key: "userName" },
    {
      header: "Hành động",
      key: "actions",
      render: (_, row) => (
        <div className="flex space-x-3">
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

  useEffect(() => {
    fetchTags();
  }, []);
  const [activeModal, setActiveModal] = useState(""); // Xác định modal đang mở

  // Xử lý mở modal cho từng bảng
  const handleAddNew = (tableTitle) => {
    setActiveModal(tableTitle);
    console.log(tableTitle);
    // Đặt tên modal đang mở
  };

  const handleCloseModal = () => {
    setActiveModal(""); // Đóng modal
  };

  // Xử lý lưu dữ liệu cho từng modal
  const handleSave = (data) => {
    console.log("Saved data:", data);
    handleCloseModal(); // Đóng modal sau khi lưu
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
        <div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Thay đổi các quy định
          </h2>
        </div>
      </div>
      <div className="flex flex-col gap-6">
        <RuleTable
          title="Loại vé"
          data={ticketTypeData}
          columns={ticketTypeColumns}
          onAddNew={handleAddNew}
        />
        <RuleTable
          title="Thể loại phim"
          data={tags}
          columns={typeColumns}
          onAddNew={handleAddNew}
        />
        <RuleTable
          title="Tài khoản"
          data={AccountData}
          columns={Accountcolumns}
          onAddNew={handleAddNew}
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
      {/* {activeModal === "Loại vé" && (
        <EmployeeModal
          isOpen={true}
          onClose={handleCloseModal}
          onSave={handleSave}
        />
      )}
      {activeModal === "Thể loại phim" && (
        <ProductModal
          isOpen={true}
          onClose={handleCloseModal}
          onSave={handleSave}
        />
      )}
      {activeModal === "Tài khoản" && (
        <SalesModal
          isOpen={true}
          onClose={handleCloseModal}
          onSave={handleSave}
        />
      )} */}
    </div>
  );
};

export default AnotherRule;

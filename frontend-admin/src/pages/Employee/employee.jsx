import React from "react";
import Table from "../../components/Table";
import { FiEdit2, FiTrash2 } from "react-icons/fi";
import { BiRefresh } from "react-icons/bi";
import { useState, useEffect } from "react";
import axios from "axios";
import Dialog from "../../components/ConfirmDialog";
import SuccessDialog from "../../components/SuccessDialog";
import RefreshLoader from "../../components/Loading";
import FailedDialog from "../../components/FailedDialog";
import EmployeeModal from "../../components/employee/employeedetail";

const Employee = () => {
  const [employee, setEmployees] = useState([]);
  const [mode, setMode] = useState("add");
  const [actionType, setActionType] = useState("");

  const [NameQuery, setNameQuery] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const [selectedEmployee, setSelectedEmployee] = useState(null);

  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [isFailModalOpen, setIsFailModalOpen] = useState(false);

  const [dialogData, setDialogData] = useState({ title: "", message: "" });
  const [loading, setLoading] = useState(false);

  const fetchemployee = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8000/api/user/employee"
      );
      setEmployees(response.data.data); // Lưu dữ liệu vào state
    } catch (error) {
      console.error("Error fetching films:", error);
    }
  };

  // Gọi API khi component được render lần đầu
  useEffect(() => {
    fetchemployee();
  }, []);

  const openConfirmDialog = (action, item = null) => {
    setActionType(action); // Xác định loại hành động
    setSelectedEmployee(item); // Gán item được chọn nếu có
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
        return `Bạn chắc chắn muốn xóa nhân viên này ?`;
      case "add":
        return "Bạn chắc chắn muốn thêm nhân viên này ?";
      case "edit":
        return `Bạn chắc chắn muốn cập nhật nhân viên này ?`;
      default:
        return "Xác nhận hành động?";
    }
  };

  //lấy message thành công
  const getSuccessMessage = (action) => {
    switch (action) {
      case "delete":
        return "Xóa nhân viên thành công";
      case "add":
        return "Thêm nhân viên thành công";
      case "edit":
        return "Cập nhật nhân viên thành công";
      default:
        return "Thao tác thành công";
    }
  };

  //Chọn cập nhật item
  const handleEditClick = (item) => {
    setSelectedEmployee(item);
    setMode("edit");
    setIsDetailModalOpen(true);
  };

  //thêm mới item
  const handleAddClick = () => {
    setMode("add");
    setSelectedEmployee(null);
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
        await axios.delete(
          `http://localhost:8000/api/user/employee/${selectedEmployee._id}`
        );
      } else if (actionType === "edit") {
        const res = await axios.put(
          `http://localhost:8000/api/user/employee/${selectedEmployee._id}`,
          selectedEmployee
        );
      } else if (actionType === "add") {
        console.log("haha: ", selectedEmployee);
        const formData = new FormData();
        formData.append("name", selectedEmployee.name);
        formData.append("birthDate", selectedEmployee.birthDate);
        formData.append("email", selectedEmployee.email);
        formData.append("phone", selectedEmployee.phone);
        formData.append("jobTitle", selectedEmployee.jobTitle);
        formData.append("salary", selectedEmployee.salary);
        formData.append("shiftStart", selectedEmployee.shiftStart);
        formData.append("shiftEnd", selectedEmployee.shiftEnd);
        await axios.post(
          "http://localhost:8000/api/user/employee",
          selectedEmployee
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
      setDialogData({
        title: "Thất bại",
        message: "Có lỗi xảy ra. Vui lòng thử lại!",
      });
      setIsFailModalOpen(true);
    } finally {
      setTimeout(() => {
        setLoading(false);
      }, 2000);
      setIsConfirmModalOpen(false);
    }
  };

  const handleEditConfirm = (item) => {
    setSelectedEmployee(item);
    console.log("item: ", item);

    // Xác định loại hành động dựa trên chế độ hiện tại
    const action = mode === "add" ? "add" : "edit";

    // Gọi dialog xác nhận với loại hành động tương ứng
    openConfirmDialog(action, item);
  };

  const columns = [
    { header: "Tên nhân viên", key: "name" },
    {
      header: "Lương",
      key: "salary",
      render: (_, row) => row.salary.toLocaleString(), // Hiển thị lương dạng 000,000
    },
    { header: "Công việc", key: "jobTitle" },
    {
      header: "Giờ bắt đầu",
      key: "shiftStart",
      render: (_, row) => {
        // Lấy giờ và phút
        const { hour, minute } = row.shiftStart;

        // Định dạng thành HH:mm
        const formattedTime = `${String(hour).padStart(2, "0")}:${String(
          minute
        ).padStart(2, "0")}`;
        return formattedTime;
      },
    },
    {
      header: "Giờ kết thúc",
      key: "shiftEnd",
      render: (_, row) => {
        // Lấy giờ và phút
        const { hour, minute } = row.shiftEnd;

        // Định dạng thành HH:mm
        const formattedTime = `${String(hour).padStart(2, "0")}:${String(
          minute
        ).padStart(2, "0")}`;
        return formattedTime;
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
            <FiTrash2 className="w-4 h-4" />
          </button>
        </div>
      ),
    },
  ];

  const handleRefresh = async () => {
    setLoading(true);
    fetchemployee();

    setTimeout(() => {
      setLoading(false);
    }, 2000);
  };

  const itemsPerPage = 7;

  const filteredData = employee.filter((item) => {
    const matchesName = NameQuery
      ? item.name.toLowerCase().includes(NameQuery.toLowerCase())
      : true;

    return matchesName;
  });

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
            Thông tin nhân viên
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
            <div className="flex items-center w-[300px]">
              <input
                type="text"
                placeholder="Tên nhân viên...."
                value={NameQuery}
                onChange={(e) => setNameQuery(e.target.value)}
                className="w-full px-4 py-2 rounded-lg focus:outline-none border"
              />
            </div>
          </div>
        </div>
        <button
          className="px-4 py-2 bg-black text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
          onClick={() => handleAddClick()}
        >
          Thêm nhân viên +
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

      <EmployeeModal
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        onSave={handleEditConfirm}
        employee={selectedEmployee}
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

export default Employee;
// ádadasdasdasdasjkdasjlksalkd

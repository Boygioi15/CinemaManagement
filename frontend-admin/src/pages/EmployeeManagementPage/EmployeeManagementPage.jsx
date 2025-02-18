import React from "react";
import Table from "../../components/Table";
import { FiEdit2, FiTrash2 } from "react-icons/fi";
import { BiRefresh } from "react-icons/bi";
import { useState, useEffect, useMemo } from "react";
import { BsSortDown } from "react-icons/bs";
import axios from "axios";
import Dialog from "../../components/Dialog/ConfirmDialog";
import SuccessDialog from "../../components/Dialog/SuccessDialog";
import RefreshLoader from "../../components/Loading";
import FailedDialog from "../../components/Dialog/FailedDialog";
import EmployeeModal from "../../components/Modal/EmployeeModal";

const EmployeeManagementPage = () => {
  const [employee, setEmployees] = useState([]);
  const [mode, setMode] = useState("add");
  const [actionType, setActionType] = useState("");
  const [sortOption, setSortOption] = useState("");

  const [NameQuery, setNameQuery] = useState("");
  const [jobQuery, setJobQuery] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const [selectedEmployee, setSelectedEmployee] = useState(null);

  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [isFailModalOpen, setIsFailModalOpen] = useState(false);

  const [dialogData, setDialogData] = useState({ title: "", message: "" });
  const [loading, setLoading] = useState(false);

  const handleDeleteFilter = () => {
    setNameQuery("");
    setJobQuery("");
  };

  const fetchemployee = async () => {
    try {
      setLoading(true); //
      const response = await axios.get(
        "http://localhost:8000/api/user/employee"
      );
      setEmployees(response.data.data); // Lưu dữ liệu vào state
    } catch (error) {
      console.error("Error fetching films:", error);
    } finally {
      setLoading(false); // End loading when API call is complete
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
      alert("Thao tác thất bại, lỗi: " + error.response.data.msg);
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

  const filteredData = useMemo(() => {
    // Lọc dữ liệu theo tên và chức vụ
    let filtered = employee.filter((item) => {
      const matchesName = NameQuery
        ? item.name
            .toLowerCase()
            .normalize("NFC")
            .includes(NameQuery.toLowerCase().normalize("NFC"))
        : true;

      const matchesJob = jobQuery
        ? item.jobTitle
            .toLowerCase()
            .normalize("NFC")
            .includes(jobQuery.toLowerCase().normalize("NFC"))
        : true;

      return matchesName && matchesJob;
    });

    // Sắp xếp dữ liệu sau khi lọc
    if (sortOption === "Asc") {
      console.log("Sắp xếp lương tăng dần");
      filtered = filtered.sort((a, b) => a.salary - b.salary); // Sắp xếp lương tăng dần
    } else if (sortOption === "Des") {
      console.log("Sắp xếp lương giảm dần");
      filtered = filtered.sort((a, b) => b.salary - a.salary); // Sắp xếp lương giảm dần
    }

    return filtered;
  }, [employee, NameQuery, jobQuery, sortOption]);

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
            <h1 className="text-xl font-bold text-gray-800 ">Lọc:</h1>
            <div className="flex items-center w-[300px]">
              <input
                type="text"
                placeholder="Tên nhân viên...."
                value={NameQuery}
                onChange={(e) => setNameQuery(e.target.value)}
                className="w-full px-4 py-2 rounded-lg focus:outline-none border"
              />
            </div>
            <div className="flex items-center w-[300px]">
              <input
                type="text"
                placeholder="Tên công việc...."
                value={jobQuery}
                onChange={(e) => setJobQuery(e.target.value)}
                className="w-full px-4 py-2 rounded-lg focus:outline-none border"
              />
            </div>
            <button
              className="mr-10 px-4 py-2 text-gray-600 bg-gray-300 rounded-lg hover:bg-gray-400"
              onClick={() => handleDeleteFilter()}
            >
              Xóa lọc
            </button>
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
                <option value="Asc">Tăng dần lương</option>
                <option value="Des">Giảm dần lương</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                <BsSortDown className="h-4 w-4" />
              </div>
            </div>
          </div>
        </div>
        <div>
          <button
            className="px-4 py-2 bg-black text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
            onClick={() => handleAddClick()}
          >
            Thêm nhân viên +
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm overflow-x-auto">
        <Table columns={columns} data={paginatedData} />

        {filteredData.length > 0 && (
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

export default EmployeeManagementPage;

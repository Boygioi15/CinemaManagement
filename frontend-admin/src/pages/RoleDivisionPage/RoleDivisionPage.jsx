import React, { useState, useEffect } from "react";
import { FaSearch, FaChevronDown, FaTimes } from "react-icons/fa";
import RefreshLoader from "../../components/Loading";
import SuccessDialog from "../../components/Dialog/SuccessDialog";
import Dialog from "../../components/Dialog/ConfirmDialog";
import FailedDialog from "../../components/Dialog/FailedDialog";
import axios from "axios";

const RoleDivisionPage = () => {
  const [searchText, setSearchText] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [selectedRoles, setSelectedRoles] = useState([]); // Trạng thái roles được chọn
  const [allRoles, setAllRoles] = useState([]);
  const [allEmployees, setAllEmployees] = useState([]);

  const [loading, setLoading] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [isFailModalOpen, setIsFailModalOpen] = useState(false);
  const [dialogData, setDialogData] = useState({ title: "", message: "" });

  const fetchRoles = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        "http://localhost:8000/api/permission/get-all-permission"
      );

      const roles = response.data.data.map((item) => ({
        id: item._id,
        name: item.name,
      }));

      setAllRoles(roles);
    } catch (error) {
      console.error("Error fetching roles:", error);
    } finally {
      setLoading(false); // End loading when API call is complete
    }
  };

  const fetchEmployees = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        "http://localhost:8000/api/user/employee"
      );

      const employees = response.data.data.map((item) => ({
        id: item._id, // Mã nhân viên
        name: item.name, // Tên nhân viên
        jobtitle: item.jobTitle,
        roles: item.roles || [], // Danh sách vai trò, mặc định là mảng rỗng nếu không có
      }));

      // Lưu vào state hoặc biến
      setAllEmployees(employees);
    } catch (error) {
      console.error("Error fetching roles:", error);
    } finally {
      setLoading(false); // End loading when API call is complete
    }
  };

  // Gọi API khi component được render lần đầu
  useEffect(() => {
    fetchRoles();
    fetchEmployees();
  }, []);

  // Lọc nhân viên
  const filteredEmployees = allEmployees.filter(
    (employee) =>
      employee.name.toLowerCase().includes(searchText.toLowerCase()) ||
      employee.jobtitle.toLowerCase().includes(searchText.toLowerCase())
  );

  // Chọn nhân viên
  const handleEmployeeSelect = async (employee) => {
    setSelectedEmployee(employee); // Lưu thông tin nhân viên
    setSearchText(`${employee.name} (${employee.jobtitle})`);
    setIsOpen(false);
    const response = await axios.get(
      `http://localhost:8000/api/permission/get-all-permission-of-employee/${employee.id}`
    );
    const permissions = response.data.data;

    const roles = permissions.map((item) => ({
      id: item.permissionID._id,
      name: item.permissionID.name,
    }));

    console.log("roles: ", roles);
    setSelectedRoles(roles);
    console.log("all roles: ", allRoles);
  };

  // Xử lý chọn checkbox
  const handleRoleChange = (role) => {
    // if (selectedRoles.includes(role)) {
    //   setSelectedRoles(selectedRoles.filter((r) => r !== role));
    // } else {
    //   setSelectedRoles([...selectedRoles, role]);
    // }

    const isSelected = selectedRoles.some(
      (selectedRole) => selectedRole.id === role.id
    );

    const updatedRoles = isSelected
      ? selectedRoles.filter((selectedRole) => selectedRole.id !== role.id) // Bỏ chọn
      : [...selectedRoles, role]; // Thêm vào

    setSelectedRoles(updatedRoles); // Cập nhật state
  };

  console.log(selectedRoles);

  // Xóa nhân viên đã chọn
  const handleClearSelection = () => {
    setSelectedEmployee(null); // Xóa thông tin nhân viên
    setSelectedRoles([]); // Reset checkbox
    setSearchText(""); // Reset ô tìm kiếm
  };

  console.log(selectedEmployee);

  const handleAddClick = () => {
    setIsConfirmModalOpen(true);
    setDialogData({
      title: "Xác nhận",
      message: "Bạn chắc chắn muốn phân quyền nhân viên này ?",
    });
  };

  const handleConfirmClick = async () => {
    if (!selectedEmployee) {
      setIsFailModalOpen(true); // Mở dialog thất bại
      setDialogData({
        title: "Thất bại",
        message: "Vui lòng chọn một nhân viên trước khi cập nhật!",
      });
      return;
    }

    try {
      setLoading(true);
      const permissionList = selectedRoles.map((role) => role.id); // Chỉ lấy ID của vai trò đã chọn

      const response = await axios.post(
        `http://localhost:8000/api/permission/update-employee-permission/${selectedEmployee.id}`,
        { permissionList }
      );

      console.log(permissionList);

      if (response.data.success) {
        setIsSuccessModalOpen(true); // Hiển thị dialog thành công
        setDialogData({
          title: "Thành công",
          message: "Cập nhật phân quyền thành công.",
        });
        handleClearSelection();
      } else {
        setIsFailModalOpen(true);
        setDialogData({
          title: "Thất bại",
          message: "Cập nhật quyền thất bại!",
        });
      }
    } catch (error) {
      setIsFailModalOpen(true);
      alert("Thao tác thất bại, lỗi: " + error.response.data.msg);
    } finally {
      setLoading(false); // Ẩn loading dù thành công hay thất bại
    }
  };

  return (
    <div>
      <div className="container mx-auto p-6 bg-gray-50 min-h-screen">
        <div className="mb-6 flex justify-between items-center pr-10">
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Phân quyền nhân viên
            </h2>
          </div>
        </div>
        <div className="w-full  p-6">
          <div className="flex items-center space-x-3">
            {/* Thêm flex để căn chỉnh nhãn và combobox */}
            <span className="text-gray-700 font-medium">Nhân viên:</span>
            {/* Nhãn */}
            {/* Ô tìm kiếm */}
            <div className="relative w-200 ">
              <div
                style={{ width: "400px" }}
                className="flex w-200 items-center border-2 border-gray-300 rounded-lg focus-within:border-blue-500"
              >
                <FaSearch className="ml-3 text-gray-400" />
                <input
                  type="text"
                  className="w-full px-4 py-2 rounded-lg focus:outline-none"
                  placeholder="Tìm kiếm theo tên hoặc ID..."
                  value={searchText}
                  onChange={(e) => {
                    setSearchText(e.target.value);
                    setIsOpen(true);
                  }}
                  onClick={() => setIsOpen(true)}
                />
                {searchText && (
                  <button
                    className="p-2 hover:bg-gray-100 rounded-r-lg"
                    onClick={handleClearSelection}
                  >
                    <FaTimes className="text-gray-400" />
                  </button>
                )}
                <button
                  className="p-2 hover:bg-gray-100 rounded-r-lg"
                  onClick={() => setIsOpen(!isOpen)}
                >
                  <FaChevronDown
                    className={`text-gray-400 transition-transform duration-200 ${
                      isOpen ? "transform rotate-180" : ""
                    }`}
                  />
                </button>
              </div>

              {/* Dropdown danh sách nhân viên */}
              {isOpen && (
                <div className="absolute w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto z-10">
                  {filteredEmployees.length > 0 ? (
                    filteredEmployees.map((employee) => (
                      <div
                        key={employee.id}
                        className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                        onClick={() => handleEmployeeSelect(employee)}
                      >
                        <div className="font-medium">{employee.name}</div>
                        <div className="text-sm text-gray-500">
                          {employee.jobtitle}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="px-4 py-2 text-gray-500">
                      No employees found
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
          {/* Danh sách checkbox roles */}
          <div className="mt-6">
            <h3 className="text-lg font-medium mb-3">Các vai trò</h3>
            <div style={{ paddingLeft: "20px" }} className="space-y-2">
              {allRoles.map((role) => (
                <label
                  key={role.id}
                  className="flex items-center space-x-3 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    className="form-checkbox h-5 w-5 text-blue-600 rounded focus:ring-blue-500"
                    checked={selectedRoles.some(
                      (selectedRole) => selectedRole.id === role.id
                    )}
                    onChange={() => handleRoleChange(role)}
                    disabled={!selectedEmployee}
                  />
                  <span className="text-gray-700">{role.name}</span>
                </label>
              ))}
            </div>
          </div>
        </div>
        <button
          style={{ marginLeft: "40px" }}
          className="ml-5 px-4 py-2 bg-black text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
          onClick={() => handleAddClick()}
        >
          Xác nhận
        </button>
      </div>
      <Dialog
        isOpen={isConfirmModalOpen}
        title={dialogData.title}
        message={dialogData.message}
        onClose={() => setIsConfirmModalOpen(false)}
        onConfirm={() => {
          handleConfirmClick();
          setIsConfirmModalOpen(false);
        }}
      />

      <SuccessDialog
        isOpen={isSuccessModalOpen}
        title={dialogData.title}
        message={dialogData.message}
        onClose={() => setIsSuccessModalOpen(false)}
      />
      <FailedDialog
        isOpen={isFailModalOpen}
        title={dialogData.title}
        message={dialogData.message}
        onClose={() => setIsFailModalOpen(false)}
      />

      <RefreshLoader isOpen={loading} />
    </div>
  );
};

export default RoleDivisionPage;

import React, { useState } from "react";
import { FaSearch, FaChevronDown, FaTimes } from "react-icons/fa";

const Role = () => {
  const employeeData = [
    { id: "EMP001", name: "John Smith", roles: ["Manager", "Developer"] },
    { id: "EMP002", name: "Sarah Johnson", roles: ["Designer", "Team Lead"] },
    { id: "EMP003", name: "Michael Brown", roles: ["Developer"] },
    { id: "EMP004", name: "Emily Davis", roles: ["Manager", "Designer"] },
    { id: "EMP005", name: "David Wilson", roles: ["Team Lead", "Developer"] },
  ];

  const allRoles = [
    "Quản lý phòng",
    "Quản lý vé",
    "Quản lý phimm",
    "Quản lý suất chiếu",
    "Quản lý nhân viên",
    "Quản lý các quy định",
    "Thống kê",
  ];

  const [searchText, setSearchText] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [selectedRoles, setSelectedRoles] = useState([]); // Trạng thái roles được chọn

  // Lọc nhân viên
  const filteredEmployees = employeeData.filter(
    (employee) =>
      employee.name.toLowerCase().includes(searchText.toLowerCase()) ||
      employee.id.toLowerCase().includes(searchText.toLowerCase())
  );

  // Chọn nhân viên
  const handleEmployeeSelect = (employee) => {
    setSelectedEmployee(employee); // Lưu thông tin nhân viên
    setSelectedRoles(employee.roles); // Cập nhật roles
    setSearchText(`${employee.name} (${employee.id})`);
    setIsOpen(false);
  };

  // Xử lý chọn checkbox
  const handleRoleChange = (role) => {
    if (selectedRoles.includes(role)) {
      setSelectedRoles(selectedRoles.filter((r) => r !== role));
    } else {
      setSelectedRoles([...selectedRoles, role]);
    }
  };

  // Xóa nhân viên đã chọn
  const handleClearSelection = () => {
    setSelectedEmployee(null); // Xóa thông tin nhân viên
    setSelectedRoles([]); // Reset checkbox
    setSearchText(""); // Reset ô tìm kiếm
  };

  return (
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
          <div className="relative w-80 ">
            <div className="flex items-center border-2 border-gray-300 rounded-lg focus-within:border-blue-500">
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
                      <div className="text-sm text-gray-500">{employee.id}</div>
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
          <div className="space-y-2">
            {allRoles.map((role) => (
              <label
                key={role}
                className="flex items-center space-x-3 cursor-pointer"
              >
                <input
                  type="checkbox"
                  className="form-checkbox h-5 w-5 text-blue-600 rounded focus:ring-blue-500"
                  checked={selectedRoles.includes(role)}
                  onChange={() => handleRoleChange(role)}
                />
                <span className="text-gray-700">{role}</span>
              </label>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Role;

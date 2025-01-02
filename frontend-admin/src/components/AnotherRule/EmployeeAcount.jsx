import React from "react";
import { FiX } from "react-icons/fi";
import { useState, useEffect, useMemo } from "react";
import { FaSearch, FaChevronDown, FaTimes } from "react-icons/fa";
import axios from "axios";

const EmployeeAccount = ({ isOpen, onClose, type, onSave, mode }) => {
  const [searchText, setSearchText] = useState("");
  const [isOpenemployee, setIsOpen] = useState(false);
  const [allEmployees, setAllEmployees] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState(null);

  const fetchEmployees = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8000/api/user/employee"
      );

      const employees = response.data.data.map((item) => ({
        id: item._id, // Mã nhân viên
        name: item.name, // Tên nhân viên
        jobtitle: item.jobTitle,
      }));

      // Lưu vào state hoặc biến
      setAllEmployees(employees);
    } catch (error) {
      console.error("Error fetching roles:", error);
    }
  };
  const handleClearSelection = () => {
    setSelectedEmployee(null); // Xóa thông tin nhân viên
    setSearchText(""); // Reset ô tìm kiếm
  };

  // Gọi API khi component được render lần đầu
  useEffect(() => {
    fetchEmployees();
  }, []);

  const filteredEmployees = allEmployees.filter(
    (employee) =>
      employee.name.toLowerCase().includes(searchText.toLowerCase()) ||
      employee.jobtitle.toLowerCase().includes(searchText.toLowerCase())
  );

  if (!isOpen) return null;

  const title = "Thêm mới tài khoản nhân viên";

  const [formData, setFormData] = useState({
    name: "",
    password: "",
    username: "",
  });

  const isFormValid = useMemo(() => {
    const requiredFields = ["password", "username", "name"];

    return requiredFields.every((field) => !!formData[field]);
  }, [formData]);

  const handleSubmit = () => {
    onSave(formData);
  };
  const handleEmployeeSelect = async (employee) => {
    setSelectedEmployee(employee); // Lưu thông tin nhân viên
    setSearchText(`${employee.name} (${employee.jobtitle})`);
    setFormData((prev) => ({
      ...prev,
      name: employee.id, // Đặt name thành ID của nhân viên
    }));
    setIsOpen(false);
  };

  return (
    // <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
    //   <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
    //     <div className="p-6">
    //       <div className="flex justify-between items-center mb-6">
    //         <h2 className="text-2xl font-bold text-gray-800">{title}</h2>
    //         <button
    //           onClick={onClose}
    //           className="text-gray-500 hover:text-gray-700"
    //         >
    //           <FiX className="w-6 h-6" />
    //         </button>
    //       </div>

    //       <div className="grid grid-cols-2 gap-6">
    //         <div className="col-span-2">
    //           <div className="flex items-center border-2 border-gray-300 rounded-lg focus-within:border-blue-500">
    //             <FaSearch className="ml-3 text-gray-400" />
    //             <input
    //               type="text"
    //               className="w-full px-4 py-2 rounded-lg focus:outline-none"
    //               placeholder="Tìm kiếm theo tên hoặc ID..."
    //               value={searchText}
    //               onChange={(e) => {
    //                 setSearchText(e.target.value);
    //                 setIsOpen(true);
    //               }}
    //               onClick={() => setIsOpen(true)}
    //             />
    //             {searchText && (
    //               <button
    //                 className="p-2 hover:bg-gray-100 rounded-r-lg"
    //                 onClick={handleClearSelection}
    //               >
    //                 <FaTimes className="text-gray-400" />
    //               </button>
    //             )}
    //             <button
    //               className="p-2 hover:bg-gray-100 rounded-r-lg"
    //               onClick={() => setIsOpen(!isOpenemployee)}
    //             >
    //               <FaChevronDown
    //                 className={`text-gray-400 transition-transform duration-200 ${
    //                   isOpen ? "transform rotate-180" : ""
    //                 }`}
    //               />
    //             </button>
    //           </div>

    //           {/* Dropdown danh sách nhân viên */}
    //           {isOpenemployee && (
    //             <div className="absolute w-auto mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto z-10">
    //               {filteredEmployees.length > 0 ? (
    //                 filteredEmployees.map((employee) => (
    //                   <div
    //                     key={employee.id}
    //                     className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
    //                     onClick={() => handleEmployeeSelect(employee)}
    //                   >
    //                     <div className="font-medium">{employee.name}</div>
    //                     <div className="text-sm text-gray-500">
    //                       {employee.jobtitle}
    //                     </div>
    //                   </div>
    //                 ))
    //               ) : (
    //                 <div className="px-4 py-2 text-gray-500">
    //                   No employees found
    //                 </div>
    //               )}
    //             </div>
    //           )}
    //         </div>

    //         <div>
    //           <label className="block text-sm font-medium text-gray-700 mb-1">
    //             Tên tài khoản
    //           </label>
    //           <input
    //             type="text"
    //             name="price"
    //             value={formData.price}
    //             onChange={(e) =>
    //               setFormData({
    //                 ...formData,
    //                 price: e.target.value,
    //               })
    //             }
    //             className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
    //           />
    //         </div>
    //         <div>
    //           <label className="block text-sm font-medium text-gray-700 mb-1">
    //             Mật khẩu
    //           </label>
    //           <input
    //             type="text"
    //             name="price"
    //             value={formData.price}
    //             onChange={(e) =>
    //               setFormData({
    //                 ...formData,
    //                 price: e.target.value,
    //               })
    //             }
    //             className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
    //           />
    //         </div>
    //       </div>

    //       <div className="flex justify-end space-x-4 mt-6">
    //         <button
    //           onClick={onClose}
    //           className="px-4 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200"
    //         >
    //           Hủy bỏ
    //         </button>
    //         <button
    //           onClick={() => {
    //             handleSubmit();
    //           }}
    //           disabled={!isFormValid}
    //           className={`px-4 py-2 rounded-lg  ${
    //             isFormValid
    //               ? "bg-blue-500 hover:bg-blue-700"
    //               : "bg-gray-400 cursor-not-allowed"
    //           } text-white`}
    //         >
    //           {isEditMode ? "Lưu thay đổi" : "Thêm loại vé"}
    //         </button>
    //       </div>
    //     </div>
    //   </div>
    // </div>
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg w-[400px] max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">{title}</h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <FiX className="w-6 h-6" />
            </button>
          </div>

          <div className="flex flex-col gap-6">
            <div className="relative">
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
                  onClick={() => setIsOpen(!isOpenemployee)}
                >
                  <FaChevronDown
                    className={`text-gray-400 transition-transform duration-200 ${
                      isOpen ? "transform rotate-180" : ""
                    }`}
                  />
                </button>
              </div>

              {isOpenemployee && (
                <div className="absolute w-auto mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto z-10">
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
                      Không tìm thấy nhân viên
                    </div>
                  )}
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tên tài khoản
              </label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    username: e.target.value,
                  })
                }
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Mật khẩu
              </label>
              <input
                type="text"
                name="password"
                value={formData.password}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    password: e.target.value,
                  })
                }
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="flex justify-end space-x-4 mt-6">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200"
            >
              Hủy bỏ
            </button>
            <button
              onClick={() => {
                handleSubmit();
              }}
              disabled={!isFormValid}
              className={`px-4 py-2 rounded-lg  ${
                isFormValid
                  ? "bg-blue-500 hover:bg-blue-700"
                  : "bg-gray-400 cursor-not-allowed"
              } text-white`}
            >
              Thêm tài khoản
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeAccount;

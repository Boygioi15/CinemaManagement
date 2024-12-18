import { useState } from "react";
import Table from "../../components/Table";
import { FiEdit2, FiTrash2 } from "react-icons/fi";

const columns = [
  { header: "Tên khách hàng", key: "customer" },
  { header: "Tên phim", key: "filmname" },
  { header: "Verify Code", key: "code" },
  { header: "Ngày chiếu", key: "daterelease" },
  { header: "Giờ chiếu", key: "hourelease" },
  { header: "Tổng tiền", key: "total" },
  {
    header: "Trạng thái",
    key: "status",
    render: (value) => (
      <span
        className={
          value === "Active"
            ? "px-2 py-1 rounded-full text-xs bg-green-100 text-green-800"
            : "px-2 py-1 rounded-full text-xs bg-red-100 text-red-800"
        }
      >
        {value}
      </span>
    ),
  },
  {
    header: "Hành động",
    key: "actions",
    render: (_, row) => (
      <div className="flex space-x-3">
        <button className="text-blue-600 hover:text-blue-800">
          <FiEdit2 className="w-4 h-4" />
        </button>
        <button className="text-red-600 hover:text-red-800">
          <FiTrash2 className="w-4 h-4" />
        </button>
      </div>
    ),
  },
];

const DuyetVe = () => {
  const [tableSearchQuery, setTableSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const mockData = [
    {
      id: 1,
      name: "John Doe",
      email: "john@example.com",
      role: "Admin",
      status: "Active",
    },
    {
      id: 2,
      name: "Jane Smith",
      email: "jane@example.com",
      role: "Editor",
      status: "Active",
    },
    {
      id: 3,
      name: "Mike Johnson",
      email: "mike@example.com",
      role: "Viewer",
      status: "Inactive",
    },
    {
      id: 4,
      name: "Sarah Wilson",
      email: "sarah@example.com",
      role: "Admin",
      status: "Active",
    },
    {
      id: 5,
      name: "Tom Brown",
      email: "tom@example.com",
      role: "Editor",
      status: "Inactive",
    },
    {
      id: 6,
      name: "John Doe",
      email: "john@example.com",
      role: "Admin",
      status: "Active",
    },
    {
      id: 7,
      name: "John Doe",
      email: "john@example.com",
      role: "Admin",
      status: "Active",
    },
    {
      id: 8,
      name: "John Doe",
      email: "john@example.com",
      role: "Admin",
      status: "Active",
    },
  ];

  const itemsPerPage = 6;

  const filteredData = mockData.filter(
    (item) =>
      item.name.toLowerCase().includes(tableSearchQuery.toLowerCase()) ||
      item.email.toLowerCase().includes(tableSearchQuery.toLowerCase()) ||
      item.role.toLowerCase().includes(tableSearchQuery.toLowerCase())
  );

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = filteredData.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          Ticket Information
        </h2>
        <div className="flex items-center w-1/4">
          <input
            type="text"
            placeholder="Enter code here..."
            value={tableSearchQuery}
            onChange={(e) => setTableSearchQuery(e.target.value)}
            className="w-full px-4 py-2 rounded-lg focus:outline-none border"
          />
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm overflow-x-auto">
        <Table columns={columns} data={paginatedData} />

        <div className="flex items-center justify-between px-6 py-4 bg-gray-50">
          <button
            onClick={() => setCurrentPage(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-4 py-2 text-sm text-gray-600 bg-white rounded-lg shadow-sm disabled:opacity-50"
          >
            Previous
          </button>
          <span className="text-sm text-gray-600">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-4 py-2 text-sm text-gray-600 bg-white rounded-lg shadow-sm disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default DuyetVe;

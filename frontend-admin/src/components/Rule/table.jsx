import { useState } from "react";
import { FaPlus } from "react-icons/fa";

const RuleTable = ({
  title,
  columns,
  data,
  onAddNew,
  currentPage,
  setCurrentPage,
}) => {
  // const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const totalPages = Math.ceil(data.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = data.slice(startIndex, startIndex + itemsPerPage);

  const handleAddNew = () => {
    if (onAddNew) {
      onAddNew(title); // Gọi callback và truyền title
    }
  };

  return (
    <div className="w-full p-4 bg-white rounded-lg shadow-lg mb-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-gray-800">{title}</h2>
        <button
          onClick={handleAddNew}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
        >
          <FaPlus className="text-sm" />
          <span>Thêm mới</span>
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full table-auto">
          <thead>
            <tr className="bg-gray-50 border-b">
              {columns.map((col, index) => (
                <th
                  key={index}
                  className="px-6 py-3 text-left text-sm font-medium text-gray-500"
                >
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paginatedData.map((row, rowIndex) => (
              <tr key={rowIndex} className="border-b hover:bg-gray-50">
                {columns.map((col, colIndex) => (
                  <td
                    key={colIndex}
                    className="px-6 py-4 text-sm text-gray-500  truncate max-w-xs"
                    title={row[col.key]}
                  >
                    {col.render ? col.render(row[col.key], row) : row[col.key]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {totalPages > 1 && (
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
  );
};

export default RuleTable;

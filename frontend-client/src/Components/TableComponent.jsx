import React from "react";

const Table = ({ headers, data }) => {
  if (data.length === 0) {
    return (
      <div className="flex justify-center items-center h-full text-gray-300 text-xl font-medium">
        Không có dữ liệu
      </div>
    );
  }

  return (
    <div className="overflow-x-auto w-full">
      <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-blue-900 text-white">
            {headers.map((header, index) => (
              <th
                key={index}
                className={`py-2 px-4 border border-gray-300 text-left ${
                  header === "Tên phim"
                    ? "w-1/3"
                    : header === "Tổng cộng"
                    ? "max-w-[150px]"
                    : "w-auto"
                }`}
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, rowIndex) => (
            <tr
              key={rowIndex}
              className={`${
                rowIndex % 2 === 0 ? "bg-blue-800" : "bg-blue-700"
              } text-white`}
            >
              {row.map((cell, cellIndex) => (
                <td
                  key={cellIndex}
                  className={`py-2 px-4 border border-gray-300 ${
                    headers[cellIndex] === "Tên phim" ||
                    headers[cellIndex] === "Tổng cộng"
                      ? "truncate max-w-[150px] overflow-hidden text-ellipsis"
                      : ""
                  }`}
                  title={
                    headers[cellIndex] === "Tên phim" ||
                    headers[cellIndex] === "Tổng cộng"
                      ? cell
                      : ""
                  }
                >
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Table;

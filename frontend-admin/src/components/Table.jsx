const Table = ({ columns, data }) => {
  return (
    <table className="w-full">
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
        {data.map((row, rowIndex) => (
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
  );
};

export default Table;

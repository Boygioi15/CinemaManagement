const TaoVe = () => {
  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-xl font-bold mb-4">Ticket Information</h2>
      <input
        type="text"
        placeholder="Enter Code here"
        className="border rounded-lg px-4 py-2 w-full mb-4"
      />
      <table className="w-full border-collapse border border-gray-200 text-sm">
        <thead>
          <tr className="bg-gray-100">
            <th className="border border-gray-300 p-2">Tên khách hàng</th>
            <th className="border border-gray-300 p-2">Tên phim</th>
            <th className="border border-gray-300 p-2">Verify Code</th>
            <th className="border border-gray-300 p-2">Ngày chiếu</th>
            <th className="border border-gray-300 p-2">Giờ chiếu</th>
            <th className="border border-gray-300 p-2">Tổng tiền</th>
            <th className="border border-gray-300 p-2">Trạng thái</th>
          </tr>
        </thead>
      </table>
    </div>
  );
};

export default TaoVe;

import { IoClose } from "react-icons/io5";

const ViewModal = ({ isOpen, onClose, filmShowDetail }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 max-w-md w-full">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">
            Thông tin suất chiếu
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <IoClose size={24} />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-gray-700 font-semibold mb-1">
              Tên phim
            </label>
            <p className="text-gray-600">{filmShowDetail.film}</p>
          </div>
          <div className="flex justify-between gap-4">
            <div className="w-1/2">
              <label className="block text-gray-700 font-semibold mb-1">
                Ngày chiếu
              </label>
              <p className="text-gray-600">{filmShowDetail.showDate}</p>
            </div>
            <div className="w-1/2">
              <label className="block text-gray-700 font-semibold mb-1">
                Thời gian chiếu
              </label>
              <p className="text-gray-600">{filmShowDetail.showTime}</p>
            </div>
          </div>
          <div className="flex justify-between gap-4">
            <div className="w-1/2">
              <label className="block text-gray-700 font-semibold mb-1">
                Dạng phim
              </label>
              <p className="text-gray-600">{filmShowDetail.showType}</p>
            </div>
            <div className="w-1/2">
              <label className="block text-gray-700 font-semibold mb-1">
                Trạng thái
              </label>
              <p
                className={`inline-block px-3 py-1 rounded-full ${
                  filmShowDetail.status === "Chưa chiếu"
                    ? "bg-yellow-100 text-yellow-800"
                    : filmShowDetail.status === "Đã hủy"
                    ? "bg-red-100 text-red-800"
                    : filmShowDetail.status === "Đã chiếu"
                    ? "bg-green-100 text-green-800"
                    : filmShowDetail.status === "Đang chiếu"
                    ? "bg-blue-100 text-blue-800"
                    : "bg-gray-100 text-gray-800" // Màu mặc định nếu không có trạng thái phù hợp
                }`}
              >
                {filmShowDetail.status}
              </p>
            </div>
          </div>
          <div>
            <label className="block text-gray-700 font-semibold mb-1">
              Phòng chiếu
            </label>
            <p className="text-gray-600">{filmShowDetail.room}</p>
          </div>
        </div>

        <div className="mt-8">
          <button
            onClick={onClose}
            className="w-full bg-gray-100 text-gray-800 py-2 px-4 rounded-lg hover:bg-gray-200 transition-colors duration-200"
          >
            Trờ về
          </button>
        </div>
      </div>
    </div>
  );
};

export default ViewModal;

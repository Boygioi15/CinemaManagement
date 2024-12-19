import { FiAlertCircle } from "react-icons/fi";

const Dialog = ({ isOpen, onClose, onConfirm, title, message, data, mode }) => {
  if (!isOpen) return null;
  console.log("hahaha");

  // const handleSubmit = async () => {
  //   if (mode === "edit") {
  //     try {
  //       const response = await axios.put(
  //         `http://localhost:8000/api/films/${data.id}`, // Dùng ID của phim trong trường hợp edit
  //         data // Dữ liệu cần cập nhật
  //       );
  //       console.log("Film updated successfully:", response.data);
  //     } catch (error) {
  //       console.error("Error updating film:", error);
  //     }
  //   } else if (mode === "add") {
  //     try {
  //       const response = await axios.post(
  //         "http://localhost:8000/api/films",
  //         data
  //       );
  //       console.log("Film added successfully:", response.data);
  //     } catch (error) {
  //       console.error("Error adding film:", error);
  //     }
  //   }
  // };
  // if (!data) {
  //   handleSubmit();
  // }
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg p-6 max-w-sm w-full absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
        <div className="flex items-start mb-4">
          <div className="text-blue-500 flex-shrink-0">
            <FiAlertCircle className="w-5 h-5" />
          </div>
          <div className="ml-3 w-full">
            <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
            <p className="mt-1 text-sm text-gray-600">{message}</p>
          </div>
        </div>
        <div className="flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200"
          >
            Trở về
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 text-white bg-yellow-600 rounded-lg hover:bg-yellow-700"
          >
            Xác nhận
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dialog;

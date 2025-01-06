import { FiAlertCircle } from "react-icons/fi";

const Dialog = ({ isOpen, onClose, onConfirm, title, message, data, mode }) => {
  if (!isOpen) return null;
  console.log("hahaha");

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-2 z-50">
      <div className="bg-white rounded-lg p-4 max-w-sm w-full absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
        <div className="flex items-start mb-4">
          <div className="text-blue-500 flex-shrink-0 pt-5">
            <FiAlertCircle className="w-5 h-5 self-center" />
          </div>
          <div className="ml-3 w-full">
            <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
            <p className="text-sm text-gray-600">{message}</p>
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

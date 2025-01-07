import { FiCheck } from "react-icons/fi";

const SuccessDialog = ({ isOpen, onClose, title, message }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-2 z-50">
      <div className="bg-white rounded-lg p-4 max-w-sm w-full absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
        <div className="flex items-start mb-4">
          <div className="text-green-500 flex-shrink-0 mt-5">
            <FiCheck className="w-5 h-5" />
          </div>
          <div className="ml-3 w-full">
            <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
            <p className="mt-1 text-sm text-gray-600">{message}</p>
          </div>
        </div>
        <div className="flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-white bg-green-600 rounded-lg hover:bg-green-400"
          >
            Xác nhận
          </button>
        </div>
      </div>
    </div>
  );
};

export default SuccessDialog;

import React, { useState, useEffect } from "react";
import { IoClose } from "react-icons/io5";

const TicketCancelModal = ({ isOpen, onClose, onConfirm }) => {
  const [reason, setReason] = useState("");
  useEffect(() => {
    if (isOpen) {
      setReason(""); // Reset reason khi modal được mở
    }
  }, [isOpen]);
  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto overflow-x-hidden bg-black bg-opacity-50">
        <div className="relative w-full max-w-md p-4 md:p-6">
          <div className="relative rounded-lg bg-white shadow-xl">
            <div className="flex items-center justify-between border-b border-gray-200 p-4">
              <h2 className="text-xl font-bold text-gray-800" id="modal-title">
                Lý do từ chối vé
              </h2>
              <button
                onClick={onClose}
                className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-200"
                aria-label="Close modal"
              >
                <IoClose className="h-5 w-5" />
              </button>
            </div>

            <div className="p-6">
              <textarea
                className="w-full resize-none rounded-lg border border-gray-300 p-3 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                rows="4"
                placeholder="Nhập lý do..."
                onChange={(e) => setReason(e.target.value)}
                aria-label="Cancellation reason"
              />
            </div>

            <div className="flex items-center justify-end gap-4 border-t border-gray-200 p-4">
              <button
                onClick={onClose}
                className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-200"
                aria-label="Cancel"
              >
                Trở về
              </button>
              <button
                onClick={() => {
                  onConfirm(reason);
                  onClose();
                }}
                disabled={!reason.trim()}
                className={`rounded-lg px-4 py-2 text-sm font-medium text-white focus:outline-none focus:ring-2 ${
                  !reason.trim()
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700 focus:ring-blue-500"
                }`}
                aria-label="Submit"
              >
                Xác nhận
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default TicketCancelModal;

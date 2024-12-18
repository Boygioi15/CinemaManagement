import React, { useState } from "react";
import { FiX } from "react-icons/fi";

const TicketDetailModal = ({ isOpen, onClose, onConfirm, onCancel, item }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg p-6 max-w-lg w-full">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold text-gray-800">
            Ticket Details
          </h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <FiX className="w-6 h-6" />
          </button>
        </div>
        <div className="space-y-4 divide-y divide-gray-200">
          <div className="grid grid-cols-2 gap-4 py-3">
            <div>
              <p className="text-sm text-gray-600">Customer Name</p>
              <p className="font-medium text-gray-900">{item.name}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Film Name</p>
              <p className="font-medium text-gray-900">{item.filmName}</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 py-3">
            <div>
              <p className="text-sm text-gray-600">Date Release</p>
              <p className="font-medium text-gray-900">{item.dateRelease}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Time</p>
              <p className="font-medium text-gray-900">{item.time}</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 py-3">
            <div>
              <p className="text-sm text-gray-600">Room Name</p>
              <p className="font-medium text-gray-900">{item.roomName}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Seat Name</p>
              <p className="font-medium text-gray-900">{item.seatName}</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 py-3">
            <div>
              <p className="text-sm text-gray-600">Verify Code</p>
              <p className="font-medium text-gray-900 bg-blue-50 px-3 py-1 rounded-md inline-block">
                {item.verifyCode}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Money</p>
              <p className="font-medium text-green-600">${item.totalMoney}</p>
            </div>
          </div>
        </div>
        <div className="mt-6 flex justify-end space-x-3">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Hủy vé
          </button>
          <button
            onClick={() => {
              onConfirm(item);
              onClose();
            }}
            className="px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
          >
            In vé
          </button>
        </div>
      </div>
    </div>
  );
};

export default TicketDetailModal;

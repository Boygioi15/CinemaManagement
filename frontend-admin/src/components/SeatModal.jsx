import React from "react";
import { FiX } from "react-icons/fi";
import { useState, useEffect } from "react";
import axios from "axios";
import {
  Combobox,
  ComboboxInput,
  ComboboxButton,
  ComboboxOptions,
  ComboboxOption,
} from "@headlessui/react";
import { FiSearch } from "react-icons/fi";

const SeatModal = ({ isOpen, onClose, onSave, mode }) => {
  if (!isOpen) return null;
  const [seatStates, setSeatStates] = useState({});

  const handleSeatClick = (seatId) => {
    setSeatStates((prev) => {
      const currentState = prev[seatId] || 0;
      const nextState = (currentState + 1) % 4;
      const [row, numStr] = seatId.match(/([A-K])(\d+)/).slice(1);
      const num = parseInt(numStr);

      if (nextState === 3) {
        if ((num === 3 || num === 12) && nextState === 3) {
          return { ...prev, [seatId]: 0 }; // Đặt lại trạng thái về 0
        }

        const prevSeatId = `${row}${num - 1}`;
        const nextSeatId = `${row}${num + 1}`;

        if (prev[nextSeatId] > 0) {
          return { ...prev, [seatId]: 0 }; // Không cho phép chuyển sang `double`, reset về `0`
        }

        if (num < 12) {
          const newState = { ...prev, [seatId]: nextState };
          newState[`${row}${num + 1}`] = -1;
          return newState;
        }
        return { ...prev, [seatId]: 0 };
      }

      if (prev[seatId] === 3) {
        const [row, numStr] = seatId.match(/([A-K])(\d+)/).slice(1);
        const num = parseInt(numStr);
        return {
          ...prev,
          [seatId]: nextState,
          [`${row}${num + 1}`]: 0,
        };
      }

      return { ...prev, [seatId]: nextState };
    });
  };

  const getSeatClassName = (seatId) => {
    const state = seatStates[seatId];
    let baseClasses =
      "m-1 rounded-lg transition-colors text-sm flex items-center justify-center ";

    if (state === -1) return baseClasses + "invisible";
    if (state === 1) return baseClasses + "w-10 h-10 bg-yellow-500 text-white";
    if (state === 2) return baseClasses + "w-10 h-10 bg-green-500 text-white";
    if (state === 3)
      return baseClasses + "w-[5.5rem] h-10 bg-blue-500 text-white";
    return baseClasses + "w-10 h-10 bg-gray-200 hover:bg-blue-300";
  };

  const generateSeats = (row) => {
    const seats = [];
    for (let i = 1; i <= 12; i++) {
      const seatId = `${row}${i}`;
      const seatState = seatStates[seatId];

      if (i === 4) {
        seats.push(<div key={`gap-${row}`} className="w-20" />);
      }

      if (seatState === -1) continue;

      const seatElement = (
        <div key={seatId} className="relative">
          <button
            className={getSeatClassName(seatId)}
            onClick={() => handleSeatClick(seatId)}
          >
            {seatState === 3 ? `${seatId}-${row}${i + 1}` : seatId}
          </button>
        </div>
      );

      seats.push(seatElement);
    }
    return seats;
  };

  const rows = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K"];
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Add New Room</h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <FiX className="w-6 h-6" />
            </button>
          </div>

          <div className="space-y-6">
            <div className="w-full h-16 bg-gray-300 rounded-t-[50%] flex items-center justify-center text-gray-600 text-sm">
              Screen
            </div>

            <div className="space-y-4">
              {rows.map((row) => (
                <div key={row} className="flex items-center">
                  <span className="w-8 text-center font-medium">{row}</span>
                  <div className="flex justify-center flex-1">
                    {generateSeats(row)}
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-end space-x-4 mt-6">
              <button
                onClick={onClose}
                className="px-4 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200"
              >
                Cancel
              </button>
              <button className="px-4 py-2 text-white bg-green-600 rounded-lg hover:bg-green-700">
                Add Room
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SeatModal;

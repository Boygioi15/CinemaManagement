import React from "react";
import { FiX } from "react-icons/fi";
import "./scrollbar.jsx";

const OrderDetailModal = ({ isOpen, onClose, item }) => {
  if (!isOpen || !item) return null;

  const orderItems = [
    { nameItem: "Popcorn Large", quantity: 2, price: 8.0 },
    { nameItem: "Coca Cola", quantity: 3, price: 3.0 },
    { nameItem: "Nachos", quantity: 1, price: 6.0 },
    { nameItem: "Popcorn Large", quantity: 2, price: 8.0 },
    { nameItem: "Coca Cola", quantity: 3, price: 3.0 },
    { nameItem: "Nachos", quantity: 1, price: 6.0 },
    { nameItem: "Popcorn Large", quantity: 2, price: 8.0 },
    { nameItem: "Coca Cola", quantity: 3, price: 3.0 },
    { nameItem: "Nachos", quantity: 1, price: 6.0 },
  ];

  const calculateItemTotal = (quantity, price) => quantity * price;
  const calculateGrandTotal = () => {
    return orderItems.reduce(
      (total, item) => total + calculateItemTotal(item.quantity, item.price),
      0
    );
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg p-6 max-w-lg w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4 sticky top-0 bg-white pt-2">
          <h3 className="text-lg font-semibold">Order Details</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <FiX className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4 overflow-y-auto">
          <div className="bg-gray-50 p-4 rounded-lg">
            <p>
              <span className="font-medium">Verify Code:</span>{" "}
              {item.verifyCode}
            </p>
            <p>
              <span className="font-medium">Date:</span> {item.releaseDate}
            </p>
          </div>

          <div className="border rounded-lg overflow-hidden">
            <div className="grid grid-cols-4 gap-4 p-3 bg-gray-50 font-medium border-b sticky top-0">
              <div className="col-span-2">Item</div>
              <div>Quantity</div>
              <div>Total</div>
            </div>

            <div className="max-h-[40vh] overflow-y-auto">
              {orderItems.map((orderItem, index) => (
                <div
                  key={index}
                  className="grid grid-cols-4 gap-4 p-3 border-b last:border-0"
                >
                  <div className="col-span-2">{orderItem.nameItem}</div>
                  <div>{orderItem.quantity}</div>
                  <div>
                    $
                    {calculateItemTotal(
                      orderItem.quantity,
                      orderItem.price
                    ).toFixed(2)}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end pt-4 border-t sticky bottom-0 bg-white">
            <div className="text-lg font-semibold">
              Grand Total: ${calculateGrandTotal().toFixed(2)}
            </div>
          </div>
        </div>

        <div className="mt-6 flex justify-end sticky bottom-0 bg-white pb-2">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

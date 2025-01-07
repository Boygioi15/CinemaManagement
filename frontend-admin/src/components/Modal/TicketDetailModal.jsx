import React from "react";
import { FiPrinter, FiArrowLeft } from "react-icons/fi";
import formatCurrencyNumber from "../../ulitilities/formatCurrencyNumber";

const TicketModal = ({ isOpen, onClose, onConfirm, order, view }) => {
  if (!isOpen) return null;
  console.log(order);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="space-y-6">
          {/* Ticket Information */}
          <div>
            <h2 className="text-xl font-bold text-gray-800 mb-4">
              Chi tiết vé
            </h2>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <p className="text-sm text-gray-500">Mã xác nhận</p>
                <p className="font-semibold">{order.verifyCode}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Mã giao dịch</p>
                <p className="font-semibold">{order._id}</p>
              </div>
              <div className="ml-10">
                <p className="text-sm text-gray-500">Trạng thái</p>
                {order.invalidReason_Printed ? (
                  <span className="inline-block px-2 py-1 text-sm font-semibold text-red-700 bg-red-100 rounded">
                    Từ chối in vé
                  </span>
                ) : order.invalidReason_Served ? (
                  <span className="inline-block px-2 py-1 text-sm font-semibold text-red-700 bg-red-100 rounded">
                    Từ chối phục vụ
                  </span>
                ) : order.served ? (
                  <span className="inline-block px-2 py-1 text-sm font-semibold text-green-700 bg-green-100 rounded">
                    Đã phục vụ
                  </span>
                ) : order.printed ? (
                  <span className="inline-block px-2 py-1 text-sm font-semibold text-blue-700 bg-blue-100 rounded">
                    Đã in
                  </span>
                ) : (
                  <span className="inline-block px-2 py-1 text-sm font-semibold text-yellow-700 bg-yellow-100 rounded">
                    Chưa in
                  </span>
                )}
              </div>
              <div>
                {order.invalidReason_Printed && (
                  <>
                    <p className="text-sm text-gray-500">Lý do từ chối in</p>
                    <p className="font-semibold">
                      {order.invalidReason_Printed}
                    </p>
                  </>
                )}
                {order.invalidReason_Served && (
                  <>
                    <p className="text-sm text-gray-500">
                      Lý do từ chối phục vụ
                    </p>
                    <p className="font-semibold">
                      {order.invalidReason_Served}
                    </p>
                  </>
                )}
              </div>
            </div>
          </div>
          <hr className="border-gray-200" />
          {/* Customer Information */}
          <div>
            <h2 className="text-xl font-bold text-gray-800 mb-4">
              Thông tin khách hàng
            </h2>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <p className="text-sm text-gray-500">Tên khách hàng</p>
                <p className="font-semibold">{order.customerInfo.name}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Email</p>
                <p className="font-semibold">{order.customerInfo.email}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">SĐT</p>
                <p className="font-semibold">{order.customerInfo.phone}</p>
              </div>
            </div>
          </div>
          <hr className="border-gray-200" />
          {/* Showtime Information */}
          {order.filmName && (
            <div>
              <h2 className="text-xl font-bold text-gray-800 mb-4">
                Thông tin suất chiếu
              </h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Tên phim</p>
                  <p className="font-semibold">{order.filmName}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Giới hạn độ tuổi</p>
                  <p className="font-semibold">{order.ageRestriction}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Ngày chiếu</p>
                  <p className="font-semibold">
                    {new Date(order.date).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Giờ chiếu</p>
                  <p className="font-semibold">{order.time}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Phòng chiếu</p>
                  <p className="font-semibold">{order.roomName}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Danh sách ghế ngồi</p>
                  <p className="font-semibold">{order.seatNames.join(", ")}</p>
                </div>
              </div>
            </div>
          )}
          {order.filmName && <hr className="border-gray-200" />}
          {/* Payment Information */}
          <div>
            <h2 className="text-xl font-bold text-gray-800 mb-4">
              Thông tin thanh toán
            </h2>

            {/* Tickets */}
            <div className="mb-4">
              <h3 className="font-semibold mb-2">Danh sách vé đã mua</h3>
              {order.tickets.map((ticket, index) => (
                <div key={index} className="flex justify-between text-sm">
                  <span>
                    {ticket.quantity}x {ticket.name}
                  </span>
                  <span>{ticket.quantity * ticket.unitPrice} VNĐ</span>
                </div>
              ))}
            </div>

            {/* Products */}
            <div className="mb-4">
              <h3 className="font-semibold mb-2">
                Danh sách các sản phẩm mua kèm
              </h3>
              {order.items.map((item, index) => (
                <div key={index} className="flex justify-between text-sm">
                  <span>
                    {item.quantity}x {item.name}
                  </span>
                  <span>{item.quantity * item.unitPrice} VNĐ</span>
                </div>
              ))}
            </div>

            <hr className="border-gray-200 my-4" />

            {/* Total */}
            <div className="flex justify-between items-center font-bold text-lg text-green-600">
              <span>Tổng thanh toán: </span>
              <span>{formatCurrencyNumber(order.totalMoney)} VNĐ</span>
            </div>
          </div>
          {/* Actions */}
          <div className="flex justify-end space-x-4 mt-6">
            <button
              className="flex items-center px-4 py-2 text-gray-600 bg-gray-100 rounded hover:bg-gray-200 transition-colors"
              onClick={onClose}
            >
              <FiArrowLeft className="mr-2" />
              Trở về
            </button>
            {view ? (
              <button
                className="flex items-center px-4 py-2 text-white bg-blue-600 rounded hover:bg-blue-700 transition-colors"
                onClick={() => {
                  onConfirm(order);
                  // onClose();
                }}
              >
                <FiPrinter className="mr-2" />
                In vé
              </button>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TicketModal;

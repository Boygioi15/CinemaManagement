import React, { useState, useEffect } from "react";
import { FiCalendar, FiSearch, FiX } from "react-icons/fi";
import axios from "axios";
import { Combobox } from "@headlessui/react";

const FilmShowModal = ({ isOpen, onClose }) => {
  const [searchQuery, setSearchQuery] = useState("");

  const [selectedDate, setSelectedDate] = useState("");
  const [selectedHour, setSelectedHour] = useState("");
  const [selectedMinute, setSelectedMinute] = useState("");

  const [selectedRoom, setSelectedRoom] = useState("");
  const [selectedMovie, setSelectedMovie] = useState("");

  const [movies, setMovies] = useState([]);
  const [rooms, setRooms] = useState([]);

  const fetchRooms = async () => {
    try {
      const response = await axios.get("http://localhost:8000/api/rooms");
      const data = response.data.data;
      const processedData = data.map((room) => ({
        id: room._id, // Lấy ID
        name: room.roomName, // Lấy tên phòng
      }));
      setRooms(processedData); // Lưu dữ liệu vào state
    } catch (error) {
      console.error("Error fetching films:", error);
    }
  };

  const fetchFilms = async () => {
    try {
      const response = await axios.get("http://localhost:8000/api/films");
      const data = response.data.data;
      const processedData = data.map((film) => ({
        id: film._id, // Lấy ID
        name: film.name, // Lấy tên phòng
      }));
      setMovies(processedData); // Lưu dữ liệu vào state
    } catch (error) {
      console.error("Error fetching films:", error);
    }
  };

  useEffect(() => {
    fetchRooms();
    fetchFilms();
  }, []);

  const filteredMovies =
    searchQuery === ""
      ? movies
      : movies.filter((movie) =>
          movie.name.toLowerCase().includes(searchQuery.toLowerCase())
        );

  const getTodayDate = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Đặt giờ về 00:00:00 để tránh lệch
    const offset = today.getTimezoneOffset(); // Lấy độ lệch múi giờ (phút)
    today.setMinutes(today.getMinutes() - offset); // Điều chỉnh giờ theo UTC
    return today.toISOString().split("T")[0]; // Lấy ngày theo định dạng yyyy-mm-dd
  };
  console.log(rooms);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="max-w-3xl w-full bg-white rounded-lg shadow-xl">
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-2xl font-bold text-gray-900">
            Tạo suất chiếu mới
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500 focus:outline-none"
          >
            <FiX className="h-6 w-6" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Movie Selection - Combobox with Search */}
          <div className="relative">
            <label
              htmlFor="film"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Chọn phim
            </label>
            <Combobox value={selectedMovie} onChange={setSelectedMovie}>
              <div className="relative">
                <div className="relative w-full cursor-default overflow-auto rounded-lg bg-white text-left border focus-within:ring-2 focus-within:ring-blue-500">
                  <Combobox.Input
                    className="w-full border-none py-2 pl-3 pr-10 text-sm leading-5 text-gray-900 focus:outline-none"
                    placeholder="Tìm kiếm phim..."
                    displayValue={(movie) => movie?.name || ""}
                    onChange={(event) => setSearchQuery(event.target.value)}
                  />
                  <Combobox.Button className="absolute inset-y-0 right-0 flex items-center pr-2">
                    <FiSearch
                      className="h-5 w-5 text-gray-400"
                      aria-hidden="true"
                    />
                  </Combobox.Button>
                </div>
                <div className="relative z-50">
                  <Combobox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                    {filteredMovies.length === 0 && searchQuery !== "" ? (
                      <div className="relative cursor-default select-none py-2 px-4 text-gray-700">
                        Không tìm thấy kết quả
                      </div>
                    ) : (
                      filteredMovies.map((movie) => (
                        <Combobox.Option
                          key={movie._id}
                          className={({ active }) =>
                            `relative cursor-default select-none py-2 pl-10 pr-4 ${
                              active
                                ? "bg-blue-600 text-white"
                                : "text-gray-900"
                            }`
                          }
                          value={movie}
                        >
                          {({ selected, active }) => (
                            <span
                              className={`block truncate ${
                                selected ? "font-medium" : "font-normal"
                              }`}
                            >
                              {movie.name}
                            </span>
                          )}
                        </Combobox.Option>
                      ))
                    )}
                  </Combobox.Options>
                </div>
              </div>
            </Combobox>
          </div>

          {/* Showtime Selection - Date and Time */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <label
                htmlFor="date"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Chọn ngày chiếu
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiCalendar className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="date"
                  id="date"
                  min={getTodayDate()}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="time"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Chọn giờ chiếu
              </label>
              <div className="flex gap-4 items-center">
                {/* Select giờ */}
                <select
                  id="hour"
                  className="block w-full pl-3 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={selectedHour}
                  onChange={(e) => setSelectedHour(e.target.value)}
                >
                  <option value="" disabled>
                    Giờ
                  </option>
                  {[...Array(24).keys()].map((hour) => (
                    <option key={hour} value={hour}>
                      {hour < 10 ? `0${hour}` : hour}
                    </option>
                  ))}
                </select>

                {/* Select phút */}
                <select
                  id="minute"
                  className="block w-full pl-3 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={selectedMinute}
                  onChange={(e) => setSelectedMinute(e.target.value)}
                >
                  <option value="" disabled>
                    Phút
                  </option>
                  {[...Array(60).keys()].map((minute) => (
                    <option key={minute} value={minute}>
                      {minute < 10 ? `0${minute}` : minute}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Room Selection - Combobox */}
          <div className="relative">
            <label
              htmlFor="room"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Select Room
            </label>
            <select
              id="room"
              value={selectedRoom}
              onChange={(e) => setSelectedRoom(e.target.value)}
              className="block w-full pl-3 pr-10 py-2 border border-gray-300 rounded-md leading-5 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="" disabled>
                Chọn phòng
              </option>
              {rooms.map((room) => (
                <option key={room.id} value={room.id}>
                  {room.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="px-6 py-4 bg-gray-50 border-t rounded-b-lg">
          <button
            type="button"
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            onClick={() => {
              console.log({
                selectedMovie,
                selectedDate,
                selectedHour,
                selectedMinute,
                selectedRoom,
              });
              onClose();
            }}
          >
            Xác nhận
          </button>
        </div>
      </div>
    </div>
  );
};

export default FilmShowModal;

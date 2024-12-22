import React, { useState, useEffect } from "react";
import { FiCalendar, FiClock, FiFilm, FiHome, FiX } from "react-icons/fi";

const FilmShowModal = ({ isOpen, onClose }) => {
  const [selectedMovie, setSelectedMovie] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const [isMovieDropdownOpen, setIsMovieDropdownOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedHour, setSelectedHour] = useState("");
  const [selectedMinute, setSelectedMinute] = useState("");

  const [selectedRoom, setSelectedRoom] = useState("");

  const moviesList = [
    "The Dark Knight",
    "Inception",
    "Interstellar",
    "Pulp Fiction",
    "The Godfather",
    "Fight Club",
    "Matrix",
    "Forrest Gump",
  ];

  const roomsList = [
    "Room 1 - IMAX",
    "Room 2 - 3D",
    "Room 3 - Standard",
    "Room 4 - VIP",
    "Room 5 - Standard",
  ];

  const filteredMovies = moviesList.filter((movie) =>
    movie.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleMovieSelect = (movie) => {
    setSelectedMovie(movie);
    setIsMovieDropdownOpen(false);
    setSearchQuery(movie);
  };

  const handleRoomSelect = (room) => {
    setSelectedRoom(room);
  };

  const getTodayDate = () => {
    const today = new Date();
    return today.toISOString().split("T")[0];
  };

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
              htmlFor="movie"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Chọn phim
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiFilm className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                id="movie"
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setIsMovieDropdownOpen(true);
                }}
                onFocus={() => setIsMovieDropdownOpen(true)}
                placeholder="Search for a movie"
                aria-label="Search for a movie"
              />
            </div>

            {isMovieDropdownOpen && filteredMovies.length > 0 && (
              <div className="absolute z-10 mt-1 w-full bg-white shadow-lg rounded-md py-1 max-h-60 overflow-auto">
                {filteredMovies.map((movie) => (
                  <button
                    key={movie}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700 focus:outline-none focus:bg-blue-50 focus:text-blue-700"
                    onClick={() => handleMovieSelect(movie)}
                  >
                    {movie}
                  </button>
                ))}
              </div>
            )}
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
              onChange={handleRoomSelect}
              className="block w-full pl-3 pr-10 py-2 border border-gray-300 rounded-md leading-5 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="" disabled>
                Select a room
              </option>
              {roomsList.map((room) => (
                <option key={room} value={room}>
                  {room}
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

import React, { useState, useEffect, useMemo } from "react";
import { FiCalendar, FiSearch, FiX } from "react-icons/fi";
import axios from "axios";
import { Combobox } from "@headlessui/react";
import RefreshLoader from "../Loading";
import Dialog from "../Dialog/ConfirmDialog";
import SuccessDialog from "../Dialog/SuccessDialog";

const FilmShowModal = ({ isOpen, onClose, onAddSuccess }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const [selectedMovie, setSelectedMovie] = useState("");

  const [movies, setMovies] = useState([]);
  const [rooms, setRooms] = useState([]);

  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
  const [isSuccessDialogOpen, setIsSuccessDialogOpen] = useState(false);
  const [dialogData, setDialogData] = useState({ title: "", message: "" });

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

  //search tên phim
  const filteredMovies =
    searchQuery === ""
      ? movies
      : movies.filter((movie) =>
          movie.name.toLowerCase().includes(searchQuery.toLowerCase())
        );

  //điều chỉnh ngày không lệch múi giờ
  const getTodayDate = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Đặt giờ về 00:00:00 để tránh lệch
    const offset = today.getTimezoneOffset(); // Lấy độ lệch múi giờ (phút)
    today.setMinutes(today.getMinutes() - offset); // Điều chỉnh giờ theo UTC
    return today.toISOString().split("T")[0]; // Lấy ngày theo định dạng yyyy-mm-dd
  };

  //Chọn phim
  const handleSelectMovie = (movie) => {
    if (!movie) {
      return;
    }
    setSelectedMovie(movie);
    setFormData((prev) => ({
      ...prev,
      film: movie.id, // Lưu ID phim đã chọn vào formData
    }));
  };

  const [formData, setFormData] = useState({
    film: "",
    showDate: "",
    hour: "",
    minute: "",
    roomId: "",
    showType: "",
  });

  //set rỗng data
  useEffect(() => {
    if (isOpen) {
      setSelectedMovie("");
      setFormData({
        film: "",
        showDate: "",
        hour: "",
        minute: "",
        roomId: "",
        showType: "",
      });
    }
  }, [isOpen]);

  const isFormValid = useMemo(() => {
    const requiredFields = [
      "film",
      "showDate",
      "hour",
      "minute",
      "roomId",
      "showType",
    ];
    return requiredFields.every(
      (field) => String(formData[field]).trim() !== ""
    );
  }, [formData]);

  //Nhấn xác nhận
  const handleSubmit = () => {
    setIsConfirmDialogOpen(true);

    setDialogData({
      title: "Xác nhận thêm mới suất chiếu",
      message: "Thêm mới suất chiếu?",
    });
  };

  //Add filmshow
  const handleFilmshow = async () => {
    setIsLoading(true);
    try {
      const { film, showDate, hour, minute, roomId, showType } = formData;

      // Ghép giờ và phút thành showTime
      // const showTime = `${hour.padStart(2, "0")}:${minute.padStart(2, "0")}:00`;
      const showTime = `${hour}:${minute}`;

      const payload = {
        film,
        showDate,
        showTime,
        roomId,
        showType,
      };

      console.log("Dữ liệu gửi đi:", payload);

      // Gửi dữ liệu đến API

      const response = await axios.post(
        "http://localhost:8000/api/film-show",
        payload
      );
      setDialogData({
        title: "Thành công",
        message: "Thêm suất chiếu thành công",
      });

      if (response.status === 200 || response.status === 201) {
        setIsLoading(false); // Tắt trạng thái loading
        setIsConfirmDialogOpen(false); // Đóng dialog xác nhận
        setIsSuccessDialogOpen(true); // Hiển thị dialog thành công
        if (onAddSuccess) {
          onAddSuccess(); // Gọi lại hàm fetchFilmShows
        }
      }
    } catch (error) {
      console.error("Lỗi từ server:", error.response?.data || error.message);
      console.error("Chi tiết lỗi:", error.response?.data?.errors);
      setIsLoading(false);
    }
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
              htmlFor="film"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Chọn phim
            </label>
            <Combobox
              value={selectedMovie}
              onChange={(movie) => handleSelectMovie(movie)}
            >
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
                  value={formData.showDate}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      showDate: e.target.value,
                    }))
                  }
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
                  value={formData.hour}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, hour: e.target.value }))
                  }
                >
                  <option value="" disabled>
                    Giờ
                  </option>
                  {[...Array(24).keys()].map((hour) => (
                    <option key={hour} value={hour < 10 ? `0${hour}` : hour}>
                      {hour < 10 ? `0${hour}` : hour}
                    </option>
                  ))}
                </select>

                {/* Select phút */}
                <select
                  id="minute"
                  className="block w-full pl-3 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={formData.minute}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, minute: e.target.value }))
                  }
                >
                  <option value="" disabled>
                    Phút
                  </option>
                  {[...Array(60).keys()].map((minute) => (
                    <option
                      key={minute}
                      value={minute < 10 ? `0${minute}` : minute}
                    >
                      {minute < 10 ? `0${minute}` : minute}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            {/* Room Selection - Combobox */}
            <div className="relative">
              <label
                htmlFor="room"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Chọn phòng chiếu
              </label>
              <select
                id="room"
                value={formData.roomId}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, roomId: e.target.value }))
                }
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
            <div className="relative">
              <label
                htmlFor="room"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Chọn dạng phim
              </label>
              <select
                name="twoDthreeD"
                value={formData.showType || ""}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    showType: e.target.value,
                  }))
                }
                className="block w-full pl-3 pr-10 py-2 border border-gray-300 rounded-md leading-5 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="" disabled>
                  vui lòng chọn dạng
                </option>
                <option value="2D">2D</option>
                <option value="3D">3D</option>
              </select>
            </div>
          </div>
        </div>

        <div className="px-6 py-4 bg-gray-50 border-t rounded-b-lg">
          <button
            type="button"
            disabled={!isFormValid}
            className={`w-full py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 ${
              isFormValid
                ? "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500" // Nếu hợp lệ
                : "bg-gray-300 text-gray-500 cursor-not-allowed" // Nếu không hợp lệ
            }`}
            onClick={() => {
              handleSubmit();
            }}
          >
            Xác nhận
          </button>
        </div>
      </div>

      <Dialog
        isOpen={isConfirmDialogOpen}
        onClose={() => setIsConfirmDialogOpen(false)}
        onConfirm={handleFilmshow}
        title={dialogData.title}
        message={dialogData.message}
      />
      <SuccessDialog
        isOpen={isSuccessDialogOpen}
        onClose={() => {
          onClose();
          setIsSuccessDialogOpen(false);
        }}
        title={dialogData.title}
        message={dialogData.message}
      />
      <RefreshLoader isOpen={isLoading} />
    </div>
  );
};

export default FilmShowModal;

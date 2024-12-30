import React, { useEffect, useState } from "react";
import { ChevronDown } from "lucide-react";
import { getShowingFilms, getShowTimeOfDateByFilmId } from "../../config/api";
import { useNavigate } from "react-router-dom";
import {
  getDayAndMonthFromISOString,
  getDayOfWeekFromISOString,
} from "../../utils/utils";

const QuickBooking = () => {
  const navigate = useNavigate();
  const [movies, setMovies] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedShowtime, setSelectedShowtime] = useState("");
  const [isMovieDropdownOpen, setIsMovieDropdownOpen] = useState(false);
  const [isDateDropdownOpen, setIsDateDropdownOpen] = useState(false);
  const [isShowtimeDropdownOpen, setIsShowtimeDropdownOpen] = useState(false);

  const [availableDates, setAvailableDates] = useState([]);
  const [availableShowtimes, setAvailableShowtimes] = useState([]);

  const handleGetDateAndShowTime = async (filmId) => {
    try {
      const response = await getShowTimeOfDateByFilmId(filmId);
      if (response?.success && response.data) {
        const formattedDates = response.data.map((item) => {
          return {
            date: item.date,
            showtimes: item.show.flatMap((s) =>
              s.showTimes.map((st) => ({
                id: st._id,
                time: st.showTime,
              }))
            ),
          };
        });
        setAvailableDates(formattedDates);
        setAvailableShowtimes([]);
      }
    } catch (error) {
      console.error("Error fetching dates and showtimes:", error);
    }
  };

  useEffect(() => {
    const fetchFilmShowing = async () => {
      try {
        const response = await getShowingFilms();
        if (response && response.data) {
          const filmShowingMap = response.data.map((film) => ({
            id: film._id,
            name: film.name,
          }));
          setMovies(filmShowingMap);
        }
      } catch {
        throw new Error("There is an error while getting film detail");
      }
    };
    fetchFilmShowing();
  }, []);

  useEffect(() => {
    setSelectedDate("");
    setSelectedShowtime("");
    if (selectedMovie?.id) {
      handleGetDateAndShowTime(selectedMovie.id);
    }
  }, [selectedMovie]);

  useEffect(() => {
    setSelectedShowtime("");
    if (selectedDate) {
      // Find showtimes for selected date
      const dateData = availableDates.find((d) => d.date === selectedDate);
      setAvailableShowtimes(dateData?.showtimes || []);
    }
  }, [selectedDate]);

  const handleMovieClick = () => {
    setIsMovieDropdownOpen(!isMovieDropdownOpen);
  };

  const handleDateClick = () => {
    if (!selectedMovie) return;
    setIsDateDropdownOpen(!isDateDropdownOpen);
  };

  const handleShowtimeClick = () => {
    if (!selectedDate) return;
    setIsShowtimeDropdownOpen(!isShowtimeDropdownOpen);
  };

  const handleNavigate = () => {
    navigate(`/movie/detail/${selectedMovie.id}`, {
      state: {
        initShowDate: selectedDate,
        initShowTime: selectedShowtime,
      },
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-4 flex items-center gap-3">
      <div className="font-bold text-2xl text-gray-800 whitespace-nowrap">
        ĐẶT VÉ NHANH
      </div>

      <div className="relative flex-1">
        <button
          className={`w-full px-4 py-3 rounded-lg text-left flex items-center justify-between bg-white border-2 border-purple-600 hover:bg-gray-50 `}
          onClick={handleMovieClick}
        >
          <span className={"text-purple-600 text-xl"}>
            {selectedMovie?.name || "2. Chọn Phim"}
          </span>
          <ChevronDown className={`w-5 h-5 text-purple-600`} />
        </button>
        {isMovieDropdownOpen && (
          <div className="absolute w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-10 text-xl">
            {movies.map((movie) => (
              <div
                key={movie.id}
                className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-black"
                onClick={() => {
                  setSelectedMovie(movie);
                  setIsMovieDropdownOpen(false);
                }}
              >
                {movie.name}
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="relative flex-1">
        <button
          className={`w-full px-4 py-3 rounded-lg text-left flex items-center justify-between ${
            selectedMovie
              ? "bg-white border-2 border-purple-600 hover:bg-gray-50"
              : "bg-gray-100 border-2 border-gray-300 cursor-not-allowed"
          }`}
          onClick={handleDateClick}
          disabled={!selectedMovie}
        >
          <span
            className={
              selectedMovie
                ? "text-purple-600 text-xl"
                : "text-gray-500 text-xl"
            }
          >
            {(selectedDate &&
              getDayOfWeekFromISOString(selectedDate) +
                "," +
                getDayAndMonthFromISOString(selectedDate)) ||
              "3. Chọn Ngày"}
          </span>
          <ChevronDown
            className={`w-5 h-5 ${
              selectedMovie ? "text-purple-600" : "text-black-400"
            }`}
          />
        </button>
        {isDateDropdownOpen && (
          <div className="absolute w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
            {availableDates.map((dateItem, index) => (
              <div
                key={index}
                className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-black text-xl"
                onClick={() => {
                  setSelectedDate(dateItem.date);
                  setIsDateDropdownOpen(false);
                }}
              >
                {getDayOfWeekFromISOString(dateItem.date) +
                  "," +
                  getDayAndMonthFromISOString(dateItem.date)}
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="relative flex-1">
        <button
          className={`w-full px-4 py-3 rounded-lg text-left flex items-center justify-between ${
            selectedDate
              ? "bg-white border-2 border-purple-600 hover:bg-gray-50"
              : "bg-gray-100 border-2 border-gray-300 cursor-not-allowed"
          }`}
          onClick={handleShowtimeClick}
          disabled={!selectedDate}
        >
          <span
            className={
              selectedDate ? "text-purple-600 text-xl" : "text-gray-500 text-xl"
            }
          >
            {selectedShowtime || "4. Chọn Suất"}
          </span>
          <ChevronDown
            className={`w-5 h-5 ${
              selectedDate ? "text-purple-600" : "text-black-400"
            }`}
          />
        </button>
        {isShowtimeDropdownOpen && (
          <div className="absolute w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
            {availableShowtimes.map((timeItem) => (
              <div
                key={timeItem.id}
                className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-black text-xl"
                onClick={() => {
                  setSelectedShowtime(timeItem.time);
                  setIsShowtimeDropdownOpen(false);
                }}
              >
                {timeItem.time}
              </div>
            ))}
          </div>
        )}
      </div>

      <button
        className={`px-6 py-3 rounded-lg font-medium whitespace-nowrap transition-colors text-xl ${
          selectedShowtime
            ? "bg-purple-700 hover:bg-purple-800 text-white"
            : "bg-gray-300 text-gray-500 cursor-not-allowed"
        }`}
        onClick={() => {
          handleNavigate();
        }}
        disabled={!selectedShowtime}
      >
        ĐẶT NGAY
      </button>
    </div>
  );
};

export default QuickBooking;

import React, { useEffect, useState } from "react";
import { getAvailableFilmByDate, getAvailableShowDate } from "../../config/api";
import { getDateStringFromISOSring } from "../../utils/utils";
import { useNavigate } from "react-router-dom";

const ShowTimePage = () => {
  const [availableShowDates, setAvailableShowDates] = useState([]);
  const [selectedDate, setSelectedDate] = useState("");

  const [availableFilm, setAvailableFilm] = useState([]);
  const [selectedFilm, setSelectedFilm] = useState("");

  const [pagination, setPagination] = useState({
    total: 0,
    currentPage: 1,
    totalPages: 0,
    limit: 2,
  });

  const navigate = useNavigate();
  const handleGetAvailableShowDate = async () => {
    const response = await getAvailableShowDate();
    if (response.success) {
      setAvailableShowDates(response.data);
      setSelectedDate(response.data[0]);
    }
  };

  const getAgeDescription = (ageRestriction) => {
    switch (ageRestriction) {
      case "T13":
        return "Phim dành cho khán giả từ đủ 13 tuổi trở lên (13+)";
      case "T16":
        return "Phim dành cho khán giả từ đủ 16 tuổi trở lên (16+)";
      case "T18":
        return "Phim dành cho khán giả từ đủ 18 tuổi trở lên (18+)";
      case "P":
        return "Phim dành cho khán giả thiếu nhi (P)";
      case "K":
        return "Phim dành cho khán giả nhỏ tuổi (K)";
      default:
        return ""; // Return an empty string or fallback message
    }
  };

  const getAllFilmByDate = async () => {
    const response = await getAvailableFilmByDate({
      date: selectedDate,
      filmId: selectedFilm,
    });
    if (response.success) {
      setAvailableFilm(response.data.films);
      setPagination(response.data.pagination);
    }
  };
  useEffect(() => {
    handleGetAvailableShowDate();
  }, []);

  useEffect(() => {
    getAllFilmByDate();
  }, [selectedDate, selectedFilm]);

  const handleNavigate = (time, currentFilmId) => {
    navigate(`/movie/detail/${currentFilmId}`, {
      state: {
        initShowDate: selectedDate,
        initShowTime: time,
      },
    });
  };

  return (
    <div className=" text-white px-[160px] gap-20 py-10 min-h-[800px]">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-8 mx-20">
        <div className="relative border border-white-400 rounded-lg p-2">
          <label
            className="block mb-2 text-2xl font-bold"
            style={{ color: "rgb(243, 234, 40)" }}
          >
            1. Ngày
          </label>
          <select
            className="w-full p-2 bg-white text-black rounded-lg text-xl font-bold"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
          >
            {availableShowDates?.map((showDate) => {
              return (
                <option value={showDate}>
                  {getDateStringFromISOSring(showDate)}
                </option>
              );
            })}
          </select>
        </div>

        <div className="relative border border-white-400 rounded-lg p-2 ">
          <label
            className="block mb-2 text-2xl font-bold"
            style={{ color: "rgb(243, 234, 40)" }}
          >
            2. Phim
          </label>
          <select
            className="w-full p-2 bg-white text-black rounded-lg text-xl font-bold"
            value={selectedFilm}
            onChange={(e) => setSelectedFilm(e.target.value)}
          >
            <option value="" disabled>
              Chọn phim
            </option>
            {availableFilm?.map((value) => {
              return (
                <option value={value.film._id}>
                  {value.film.name +
                    " (" +
                    value.film?.ageRestriction +
                    ")" +
                    " " +
                    value.film?.voice}
                </option>
              );
            })}
          </select>
        </div>
      </div>
      <hr className="pb-8" />

      {availableFilm.map((value) => {
        const filmDetail = value.film;
        const filmTypes = value.filmTypes;
        return (
          <>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <div className="md:col-span-1">
                <img
                  src={filmDetail?.thumbnailURL}
                  alt="Movie Poster"
                  className="w-full rounded-lg shadow-lg"
                />

                <div className="mt-4">
                  <h3 className="text-2xl font-bold">
                    {filmDetail.name +
                      " (" +
                      filmDetail?.ageRestriction +
                      ")" +
                      " " +
                      filmDetail?.voice}
                  </h3>
                  <div className="mt-2 space-y-1">
                    <div className="flex items-center">
                      <span className="text-yellow-400 mr-2 text-xl">⌚</span>
                      <span className="text-xl">
                        {filmDetail.filmDuration}p
                      </span>
                    </div>
                    <div className="flex items-center">
                      <span className="text-yellow-400 mr-2 text-xl">🌏</span>
                      <span className="text-xl">
                        {" "}
                        {filmDetail.originatedCountry}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <span className="text-yellow-400 mr-2 text-xl">🎬</span>
                      <span className="text-xl"> {filmDetail.voice}</span>
                    </div>
                    <div className="flex items-center">
                      <span className="text-yellow-400 mr-2 text-xl">👥</span>
                      <span className="text-xl">
                        {filmDetail.ageRestriction +
                          " : " +
                          getAgeDescription(filmDetail.ageRestriction)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="md:col-span-3 space-y-6">
                <div className=" rounded-lg p-4 border border-white-400 ">
                  <div className="flex items-center mb-4"></div>
                  <div className="space-y-4 text-xl">
                    <div>
                      {filmTypes.map((value) => {
                        return (
                          <>
                            <div className="space-y-4 text-xl">
                              <div className="text-xl text-gray-400 mb-2 ">
                                Thể loại chiếu: {value.filmType}
                              </div>
                              <div className="flex flex-wrap gap-4 pb-4">
                                {value.showTimes.map((time) => (
                                  <button
                                    key={time}
                                    className="px-4 py-2 bg-gray-700 hover:bg-yellow-500 rounded transition-colors"
                                    onClick={() =>
                                      handleNavigate(time, filmDetail._id)
                                    }
                                  >
                                    {time}
                                  </button>
                                ))}
                              </div>
                            </div>
                          </>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            ;
          </>
        );
      })}
      {/* Movie Info Section */}

      <hr className="pb-8" />
    </div>
  );
};

export default ShowTimePage;

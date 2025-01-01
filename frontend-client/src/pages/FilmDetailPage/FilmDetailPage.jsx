import React, { useState, useEffect } from "react";
import {
  FaTag,
  FaRegClock,
  FaGlobeAmericas,
  FaCommentDots,
} from "react-icons/fa";
import { LuUserRoundCheck } from "react-icons/lu";
import { FaRegCirclePlay } from "react-icons/fa6";
import "./filmPage.css";
import FilmInfoSection from "../../Components/FilmInfoSection";
import TrailerModal from "../../Components/TrailerModal";
import axios from "axios";
import ScheduleChooseBox from "../../Components/ScheduleChooseBox";
import ShowtimeChooseBox from "../../Components/ShowtimeChooseBox";
import FoodCard from "../../Components/FoodCard";
import TicketType from "../../Components/TicketType";
import { useParams } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { getShowTimeOfDateByFilmId } from "../../config/api";
const FilmDetailPage = () => {
  const { filmID } = useParams();

  const location = useLocation();
  const { initShowDate, initShowTime } = location.state || {};

  const [videoOpen, setVideoOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(initShowDate || "");
  const [selectedShowtime, setSelectedShowtime] = useState(initShowTime || "");
  console.log("🚀 ~ FilmDetailPage ~ selectedShowtime:", selectedShowtime);

  const [availableDates, setAvailableDates] = useState([]);
  const [availableShowtimesWithFilmType, setAvailableShowtimesWithFilmType] =
    useState([]);

  const handleGetDateAndShowTime = async (filmID) => {
    try {
      const response = await getShowTimeOfDateByFilmId(filmID);
      if (response?.success && response.data) {
        setAvailableDates(response.data);
        setAvailableShowtimesWithFilmType([]);
      }
    } catch (error) {
      console.error("Error fetching dates and showtimes:", error);
    }
  };

  useEffect(() => {
    setSelectedShowtime("");
    if (selectedDate) {
      const dateData = availableDates.find((d) => d.date === selectedDate);
      setAvailableShowtimesWithFilmType(dateData?.show || []);
    }
  }, [selectedDate]);

  useEffect(() => {
    if (availableDates.length > 0) {
      if (initShowDate && initShowTime) {
        const initDateData = availableDates.find(
          (d) => d.date === initShowDate
        );
        setSelectedDate(initShowDate);
        setAvailableShowtimesWithFilmType(initDateData?.show || []);

        // Kiểm tra và set selectedShowtime khi showtimes có dữ liệu
        const initShowtimeExists = initDateData?.show?.some((group) =>
          group.showTimes.some((showtime) => showtime.showTime === initShowTime)
        );
        if (initShowtimeExists) {
          setSelectedShowtime(initShowTime);
        }
      } else {
        setSelectedDate(availableDates[0].date);
        setAvailableShowtimesWithFilmType(availableDates[0].show);
      }
    }
  }, [availableDates]);

  const [filmDetail, setFilmDetail] = useState();
  useEffect(() => {
    const fetchFilmDetail = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8000/api/films/${filmID}/getFilmDetail`
        );
        if (response && response.data) {
          setFilmDetail(response.data.data);
        }
      } catch (error) {
        console.error("Error fetching film details:", error);
      }
    };

    fetchFilmDetail();
    handleGetDateAndShowTime(filmID);
  }, []);

  if (!filmDetail) {
    return <div>Loading...</div>;
  }

  // Mapping ageLimit to appropriate category
  const getAgeCategory = (ageLimit) => {
    switch (ageLimit) {
      case "T13":
      case "T16":
        return "TEEN";
      case "T18":
        return "ADULT";
      case "P":
      case "K":
        return "KID";
      default:
        return "ADULT"; // Default case if age is unrecognized
    }
  };
  // Function to get the age description
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
  return (
    <div className="p-6 space-y-12 md:space-y-40">
      <div className="grid items-start grid-cols-5 gap-6 md:gap-12 rounded-lg">
        <div className="col-span-2 w-full h-full top-0 text-center relative ">
          <div className="relative border border-gray-300 rounded-lg ">
            {/* Hình ảnh phim */}
            <img
              src={filmDetail.thumbnailURL}
              alt="Film Thumbnail"
              className="w-full h-full object-cover rounded-lg "
            />

            <div>
              <div className="absolute top-0 left-0 flex items-center">
                <div className="flex items-center">
                  {/* Nhãn 2D */}
                  {filmDetail.twoDthreeD.includes("2D") && (
                    <div className="flex bg-[#FF9933] w-[33px] h-[35px] lg:w-[71px] lg:h-[78px] justify-center items-center shadow-md">
                      <span className="border-2 border-black p-0.5 text-xs rounded-md font-interBold text-black">
                        2D
                      </span>
                    </div>
                  )}

                  {/* Conditionally render 3D */}
                  {filmDetail.twoDthreeD.includes("3D") && (
                    <div className="flex bg-[#663399] w-[33px] h-[35px] lg:w-[71px] lg:h-[78px] justify-center items-center shadow-md">
                      <span className="border-2 border-white p-0.5 text-xs rounded-md font-interBold text-white">
                        3D
                      </span>
                    </div>
                  )}
                  {/* Nhãn T13, T16, T18, P, K */}
                  <div className="flex flex-col w-[33px] h-[35px] lg:w-[71px] lg:h-[78px] items-center justify-center bg-[#FF0033] shadow-md">
                    <span className="text-white font-interBold overflow-hidden text-sm">
                      {filmDetail.ageRestriction}
                    </span>
                    <span className="px-0.5 bg-black text-white font-interBold text-[0.5rem] tracking-widest">
                      {getAgeCategory(filmDetail.ageRestriction)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-span-3 pt-6 space-y-10">
          <h1 className="rounded-full w-full h-6 flex items-center justify-start font-interExtraBold">
            {filmDetail.name}
          </h1>

          <div className="flex flex-col items-start justify-start space-y-4 text-left w-full mt-4 film-info">
            <p className="flex items-center mt-2">
              <FaTag className="icon-style" />
              Thể loại: {filmDetail.tagsRef.map((tag) => tag.name).join(", ")}
            </p>
            <p className="flex items-center mt-2">
              <FaRegClock className="icon-style" />
              {`${filmDetail.filmDuration} phút`}
            </p>
            <p className="flex items-center mt-2">
              <FaGlobeAmericas className="icon-style" />
              Quốc gia: {filmDetail.originatedCountry}
            </p>
            <p className="flex items-center mt-2">
              <FaCommentDots className="icon-style" />
              Phụ đề: {filmDetail.voice}
            </p>
            <p className="flex items-center mt-2">
              <LuUserRoundCheck className="icon-style" />{" "}
              <span className="bg-mainColor text-black">
                {filmDetail.ageRestriction}:{" "}
                {getAgeDescription(filmDetail.ageRestriction)}
              </span>
            </p>
          </div>
          <div>
            <FilmInfoSection
              className="hidden md:block"
              filmContent={filmDetail.filmContent}
              filmDescription={filmDetail.filmDescription}
            />
          </div>
          <button
            className="flex items-center text-[1.5rem]"
            onClick={() => setVideoOpen(true)}
          >
            <div className="flex items-center justify-center mr-2">
              <FaRegCirclePlay className="w-[31px] h-[31px] text-[#fe1e3e] bg-[#d9d9d9] rounded-full" />
            </div>
            <span className="text-white border-b-2">Xem trailer</span>
          </button>
        </div>
        {/* Sử dụng TrailerModal */}
        <TrailerModal
          videoOpen={videoOpen}
          setVideoOpen={setVideoOpen}
          videoUrl={filmDetail.trailerURL}
        />
      </div>
      <FilmInfoSection
        className="block md:hidden mt-6"
        filmContent={filmDetail.filmContent}
        filmDescription={filmDetail.filmDescription}
      />
      <div>
        <div className="flex flex-col justify-center items-center space-y-12">
          <h1 className="font-interExtraBold">LỊCH CHIẾU</h1>
          <div className="flex flex-wrap justify-center items-center mt-6 gap-4">
            {availableDates.map((dateGroup) => {
              return (
                <ScheduleChooseBox
                  date={dateGroup.date}
                  isSelected={selectedDate === dateGroup.date}
                  onClick={() => setSelectedDate(dateGroup.date)}
                />
              );
            })}
          </div>

          {availableShowtimesWithFilmType?.map((dataGroup) => {
            return (
              <div className="flex flex-col justify-center items-center space-y-2">
                <h1 className="font-interExtraBold">SUẤT CHIẾU</h1>
                <h2 className="font-interBold">{dataGroup.showType}</h2>
                <hr className="text-white w-full p-1"></hr>
                <div className="flex flex-wrap justify-center items-center mt-6 gap-4">
                  {dataGroup?.showTimes?.map((value) => {
                    return (
                      <ShowtimeChooseBox
                        time={value.showTime}
                        isSelected={selectedShowtime === value.showTime}
                        onClick={() => setSelectedShowtime(value.showTime)}
                      />
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="flex flex-col justify-center items-center space-y-12">
        <h1 className="font-interExtraBold">CHỌN LOẠI VÉ</h1>
        <div className="flex flex-wrap lg:grid lg:grid-cols-3 justify-center items-center mt-6 gap-4 lg:gap-8">
          <TicketType />
          <TicketType />
          <TicketType />
        </div>
      </div>

      <div className="flex flex-col justify-center items-center space-y-12">
        <h1 className="font-interExtraBold">CHỌN BẮP NƯỚC</h1>
        <div className="flex flex-wrap justify-center items-center mt-6 gap-4 md:gap-8">
          <FoodCard />
          <FoodCard />
          <FoodCard />
          <FoodCard />
          <FoodCard />
          <FoodCard />
          <FoodCard />
        </div>
      </div>
    </div>
  );
};

export default FilmDetailPage;

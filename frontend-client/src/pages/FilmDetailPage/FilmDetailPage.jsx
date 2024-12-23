// pages/FilmDetailPage.jsx
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

const FilmDetailPage = () => {
  const { filmID } = useParams();
  const ageLimit = 18;
  const [videoOpen, setVideoOpen] = useState(false);
  const [selectedSchedule, setSSelectedSchedule] = useState("19/12");
  const [selectedShowtime, setSelectedShowtime] = useState("19/12");

  const handleDateClick = (date) => {
    setSSelectedSchedule(date);
  };
  const handleTimeClick = (time) => {
    setSelectedShowtime(time);
  };

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
        console.log(response.data.data);
      } catch {
        throw new Error("There is an error while getting film detail");
      }
    };
    fetchFilmDetail();
  }, []);
  if (!filmDetail) {
    return;
  }
  return (
    <div className="p-6 space-y-12 md:space-y-40">
      <div className="grid items-start grid-cols-5 gap-6 md:gap-12 rounded-lg">
        <div className="col-span-2 w-full h-full top-0 text-center relative ">
          <div className="relative border border-gray-300 rounded-lg ">
            {/* Hình ảnh phim */}
            <img
              src= {filmDetail.thumbnailURL}
              alt="Phim"
              className="w-full h-full object-cover rounded-lg "
            />

            <div>
              <div className="absolute top-0 left-0 flex items-center">
                <div className="flex items-center">
                  {/* Nhãn 2D */}
                  <div className="flex bg-[#FF9933] w-[33px] h-[35px] lg:w-[71px] lg:h-[78px] justify-center items-center rounded-tl-md">
                    <span className="border-2 border-black p-0.5 text-xs rounded-md font-interBold text-black">
                      2D
                    </span>
                  </div>
                  {/* Nhãn T13 TEEN hoặc ADULT */}
                  <div className="flex flex-col w-[33px] h-[35px] lg:w-[71px] lg:h-[78px] items-center justify-center bg-[#FF0033] shadow-md">
                    <span className="text-white font-interBold overflow-hidden text-sm">
                      T{ageLimit}
                    </span>
                    {ageLimit < 18 ? (
                      <span className="px-0.5 bg-black text-white font-interBold text-[0.5rem] tracking-widest">
                        TEEN
                      </span>
                    ) : (
                      <span className="px-0.5 bg-black text-white font-interBold text-[0.5rem] tracking-widest">
                        ADULT
                      </span>
                    )}
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
            <p className="flex items-center mt-2 ">
              <FaTag className="icon-style" />
              Thể loại: {}
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
                T16: Phim dành cho khán giả từ đủ 16 tuổi trở lên (16+)
              </span>
            </p>
          </div>
          <div>
            <FilmInfoSection className="hidden md:block" />
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
          videoUrl="https://www.youtube-nocookie.com/embed/WHmHpntEMbk?controls=1&enablejsapi=1&rel=0&fs=1"
        />
      </div>
      <FilmInfoSection className="block md:hidden mt-6" />
      <div>
        <div className="flex flex-col justify-center items-center space-y-12">
          <h1 className="font-interExtraBold">LỊCH CHIẾU</h1>
          <div className="flex flex-wrap justify-center items-center mt-6 gap-4">
            <ScheduleChooseBox
              date="19/12"
              isSelected={selectedSchedule === "19/12"}
              onClick={() => handleDateClick("19/12")}
            />
            <ScheduleChooseBox
              date="20/12"
              isSelected={selectedSchedule === "20/12"}
              onClick={() => handleDateClick("20/12")}
            />
            <ScheduleChooseBox
              date="21/12"
              isSelected={selectedSchedule === "21/12"}
              onClick={() => handleDateClick("21/12")}
            />
          </div>
          <div className="flex flex-col justify-center items-center space-y-2">
            <h1 className="font-interExtraBold">SUẤT CHIẾU</h1>
            <h2 className="font-interBold">2D</h2>
            <hr className="text-white w-full p-1"></hr>
            <div className="flex flex-wrap justify-center items-center mt-6 gap-4">
              <ShowtimeChooseBox
                time="19/12"
                isSelected={selectedShowtime === "19/12"}
                onClick={() => handleTimeClick("19/12")}
              />
              <ShowtimeChooseBox
                time="20/12"
                isSelected={selectedShowtime === "20/12"}
                onClick={() => handleTimeClick("20/12")}
              />
              <ShowtimeChooseBox
                time="21/12"
                isSelected={selectedShowtime === "21/12"}
                onClick={() => handleTimeClick("21/12")}
              />
            </div>
          </div>
          <div className="flex flex-col justify-center items-center space-y-2">
            <h2 className="font-interBold">3D</h2>
            <hr className="text-white w-full p-1"></hr>
            <div className="flex flex-wrap justify-center items-center mt-4 gap-4">
              <ShowtimeChooseBox
                time="19/12"
                isSelected={selectedShowtime === "19/12"}
                onClick={() => handleTimeClick("19/12")}
              />
              <ShowtimeChooseBox
                time="20/12"
                isSelected={selectedShowtime === "20/12"}
                onClick={() => handleTimeClick("20/12")}
              />
              <ShowtimeChooseBox
                time="21/12"
                isSelected={selectedShowtime === "21/12"}
                onClick={() => handleTimeClick("21/12")}
              />
            </div>
          </div>
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

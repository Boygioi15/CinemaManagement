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
import axios from "axios"
const FilmDetailPage = ({filmID = "674eb734338a95c043b02c5a"}) => {
  const ageLimit = 18;
  const [videoOpen, setVideoOpen] = useState(false);

  const [filmDetail, setFilmDetail] = useState();
  useEffect( ()=>{
    const fetchFilmDetail = async() => {
      try{
        const response = await axios.get(`http://localhost:8000/api/films/${filmID}/getFilmDetail`);
        if(response && response.data){
          setFilmDetail(response.data.data)
        }
        console.log(response.data.data)
      }
      catch{
        throw new Error("There is an error while getting film detail")
      }
    }
    fetchFilmDetail();
  },[])
  if(!filmDetail){
    return;
  }
  return (
    <div className="p-6">
      <div className="grid items-start grid-cols-5 gap-12 rounded-lg">
        <div className="col-span-2 w-full h-full top-0 text-center relative ">
          <div className="relative border border-gray-300 rounded-lg ">
            {/* Hình ảnh phim */}
            <img
              src="https://res.cloudinary.com/ddrfocetn/image/upload/v1732590791/rkq5zo350eovgemvkjyb.jpg"
              alt="Phim"
              className="w-full h-full object-cover rounded-lg "
            />

            <div>
              <div className="absolute top-0 left-0 flex items-center">
                <div className="flex items-center">
                  {/* Nhãn 2D */}
                  <div className="flex bg-[#FF9933] w-[33px] h-[35px] lg:w-[71px] lg:h-[78px] justify-center items-center rounded-tl-md">
                    <span className="border-2 border-black p-0.5 text-xs rounded-md font-thin text-black">
                      2D
                    </span>
                  </div>
                  {/* Nhãn T13 TEEN hoặc ADULT */}
                  <div className="flex flex-col w-[33px] h-[35px] lg:w-[71px] lg:h-[78px] items-center justify-center bg-[#FF0033] shadow-md">
                    <span className="text-white font-thin overflow-hidden text-sm">
                      T{ageLimit}
                    </span>
                    {ageLimit < 18 ? (
                      <span className="px-0.5 bg-black text-white text-[0.5rem] tracking-widest">
                        TEEN
                      </span>
                    ) : (
                      <span className="px-0.5 bg-black text-white text-[0.5rem] tracking-widest">
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
          <h1 className="rounded-full w-full h-6 flex items-center justify-start">
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
              <span className="bg-[#F3EA28] text-black">
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
      </div>
      <FilmInfoSection className="block md:hidden mt-6" />

      {/* Sử dụng TrailerModal */}
      <TrailerModal
        videoOpen={videoOpen}
        setVideoOpen={setVideoOpen}
        videoUrl="https://www.youtube.com/embed/zqH4AA-KEgQ?si=G3rf7WBzteyUb6AE"
      />
    </div>
  );
};

export default FilmDetailPage;

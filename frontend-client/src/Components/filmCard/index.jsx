import {
  FaTag,
  FaRegClock,
  FaGlobeAmericas,
  FaCommentDots,
} from "react-icons/fa";
import { PiPlayCircleFill } from "react-icons/pi";
import "./style.css";
import CustomButton from "../button";
import TrailerModal from "../TrailerModal";
import { useState } from "react";
import { FaRegCirclePlay } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";

const FilmCard = ({
  filmId,
  imageUrl,
  name,
  country,
  type,
  duration,
  ageLimit,
  isShowing,
  voice,
  trailerURL,
  twoDthreeD, // Array for 2D or 3D formats
}) => {
  const linkDetail = `/movie/detail/${filmId}`;
  const navigate = useNavigate();
  const [videoOpen, setVideoOpen] = useState(false);

  // Logic for Age Limit
  const getAgeLabel = () => {
    if (ageLimit === "T13" || ageLimit === "T16") {
      return "TEEN";
    }
    if (ageLimit === "T18") {
      return "ADULT";
    }
    if (ageLimit === "P" || ageLimit === "K") {
      return "KID";
    }
    return ""; // Default case
  };

  const handleClickOverlay = () => {
    navigate(linkDetail);
  };

  return (
    <div className="flex flex-wrap justify-center gap-5 p-2">
      {/* FilmCard with flexbox */}
      <div className="flex flex-col items-start gap-2 w-full max-w-xs group">
        {/* FilmCard with hover effects */}
        <div className="relative border cursor-pointer border-gray-300 rounded-lg overflow-hidden shadow-md transition-transform duration-300 sm:hover:shadow-lg aspect-[2/3] w-full">
          {/* Film image */}
          <img
            src={imageUrl}
            alt={name}
            className="w-full h-full object-cover"
          />

          {/* Labels for 2D, 3D and Age Limit */}
          <div className="absolute top-0 left-0 flex items-center transition-transform duration-300 ease-in-out transform sm:group-hover:-translate-y-full">
            <div className="flex items-center transition-transform duration-300 ease-in-out transform">
              {/* Conditionally render 2D */}
              {twoDthreeD.includes("2D") && (
                <div className="flex bg-[#FF9933] w-[39px] h-[45px] justify-center items-center shadow-md">
                  <span className="border-2 border-black p-0.5 text-xs rounded-md font-interBold text-black">
                    2D
                  </span>
                </div>
              )}

              {/* Conditionally render 3D */}
              {twoDthreeD.includes("3D") && (
                <div className="flex bg-[#663399] w-[39px] h-[45px] justify-center items-center shadow-md">
                  <span className="border-2 border-white p-0.5 text-xs rounded-md font-interBold text-white">
                    3D
                  </span>
                </div>
              )}

              {/* Age Limit */}
              <div className="flex flex-col w-[39px] h-[45px] items-center justify-center bg-[#FF0033] shadow-md">
                <span className="text-white font-interBold overflow-hidden text-sm">
                  {ageLimit}
                </span>
                <span className="px-0.5 bg-black text-white text-[0.5rem] tracking-widest">
                  {getAgeLabel()}
                </span>
              </div>
            </div>
          </div>

          {/* Overlay text */}
          <div
            className="absolute inset-0 z-1 bg-black bg-opacity-70 opacity-0 transition-opacity duration-300 hidden sm:flex justify-center items-center text-center sm:group-hover:opacity-100 content-text"
            onClick={() => handleClickOverlay()}
          >
            <div className="flex flex-col items-start justify-start px-[38px] space-y-4 text-left w-full">
              <h3 className="mb-3 text-lg">
                {name} ({ageLimit})
              </h3>
              <p className="flex items-center mt-2">
                <FaTag className="w-5 h-5 mr-2 align-middle" />
                {type}
              </p>
              <p className="flex items-center mt-2">
                <FaRegClock className="w-5 h-5 mr-2 align-middle" />
                {duration} phút
              </p>
              <p className="flex items-center mt-2">
                <FaGlobeAmericas className="w-5 h-5 mr-2 align-middle" />
                {country}
              </p>
              <p className="flex items-center mt-2">
                <FaCommentDots className="w-5 h-5 mr-2 align-middle" />
                {voice}
              </p>
            </div>
          </div>
        </div>

        {/* Info Section */}
        <div className="w-full">
          <a
            href={linkDetail}
            className="font-bold text-lg mt-3 h-[48px] overflow-hidden line-clamp-2 text-white text-center group-hover:text-mainColor cursor-pointer"
          >
            {name} ({ageLimit})
          </a>
          <div className="flex justify-between mt-3 pt-4 button-font">
            {/* Trailer button for larger screens */}
            <button
              className="hidden sm:flex items-center"
              onClick={() => setVideoOpen(true)}
            >
              <div className="flex items-center justify-center mr-2">
                <FaRegCirclePlay className="w-[31px] h-[31px] text-[#fe1e3e] bg-[#d9d9d9] rounded-full" />
              </div>
              <span className="text-white border-b-2">Xem trailer</span>
            </button>
            <TrailerModal
              videoOpen={videoOpen}
              setVideoOpen={setVideoOpen}
              videoUrl={trailerURL}
            />

            {/* Custom button */}
            <CustomButton
              defaultColor="#F3EA28" /* Default background color */
              gradientFrom="#663399" /* Gradient start color */
              gradientTo="#3366CC" /* Gradient end color */
              textColor="#000000" /* Text color */
              hoverTextColor="#FFFFFF" /* Text color on hover */
              href={linkDetail}
              className="w-full h-[40px] sm:w-[119px]"
              text={
                isShowing ? "Đặt vé" : "Tìm hiểu thêm"
              } /* Conditional text */
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default FilmCard;

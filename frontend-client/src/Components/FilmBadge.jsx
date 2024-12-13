import React from "react";

const FilmBadge = ({ w, h, ageLimit }) => {
  return (
    <div className="flex items-center transition-transform duration-300 ease-in-out transform">
      {/* Nhãn 2D */}
      <div
        className="flex bg-[#FF9933] justify-center items-center shadow-md"
        style={{ width: w, height: h }}
      >
        <span className="border-2 border-black p-0.5 text-xs rounded-md font-thin text-black">
          2D
        </span>
      </div>
      {/* Nhãn T13 TEEN hoặc ADULT */}
      <div
        className="flex flex-col items-center justify-center bg-[#FF0033] shadow-md"
        style={{ width: w, height: h }}
      >
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
  );
};

export default FilmBadge;

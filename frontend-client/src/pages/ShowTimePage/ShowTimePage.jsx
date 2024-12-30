import React from "react";

const ShowTimePage = () => {
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
          <select className="w-full p-2 bg-white text-black rounded-lg text-xl font-bold">
            <option>Hôm Nay 30/12</option>
          </select>
        </div>

        <div className="relative border border-white-400 rounded-lg p-2 ">
          <label
            className="block mb-2 text-2xl font-bold"
            style={{ color: "rgb(243, 234, 40)" }}
          >
            2. Phim
          </label>
          <select className="w-full p-2 bg-white text-black rounded-lg text-xl font-bold">
            <option>Chọn Phim</option>
          </select>
        </div>
      </div>

      {/* Movie Info Section */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="md:col-span-1">
          <img
            src="http://res.cloudinary.com/ddrfocetn/image/upload/v1734444865/cinema_OOP/egw6kwpxyutfdsuro19a.webp"
            alt="Movie Poster"
            className="w-full rounded-lg shadow-lg"
          />

          <div className="mt-4">
            <h3 className="text-2xl font-bold">404 CHẠY NGAY ĐI (T16) LT</h3>
            <div className="mt-2 space-y-1">
              <div className="flex items-center">
                <span className="text-yellow-400 mr-2 text-xl">⌚</span>
                <span className="text-xl">104</span>
              </div>
              <div className="flex items-center">
                <span className="text-yellow-400 mr-2 text-xl">🌏</span>
                <span className="text-xl">Thái lan</span>
              </div>
              <div className="flex items-center">
                <span className="text-yellow-400 mr-2 text-xl">🎬</span>
                <span className="text-xl">Lồng Tiếng</span>
              </div>
              <div className="flex items-center">
                <span className="text-yellow-400 mr-2 text-xl">👥</span>
                <span className="text-xl">
                  T16: Phim dành cho khán giả từ đủ 16 tuổi trở lên (16+)
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Showtimes Section */}
        <div className="md:col-span-3 space-y-6">
          {/* Cinema Location Cards */}
          {["Kiên Giang"].map((cinema) => (
            <div
              key={cinema}
              className=" rounded-lg p-4 border border-white-400 "
            >
              <div className="flex items-center mb-4"></div>

              <div className="text-sm text-gray-400 mb-4">
                {cinema === "Quốc Thanh" &&
                  "271 Nguyễn Trãi, Phường Nguyễn Cư Trinh, Quận 1, Thành Phố Hồ Chí Minh"}
              </div>

              <div className="space-y-4 text-xl">
                <div>
                  <div className="text-xl text-gray-400 mb-2 ">STANDARD</div>
                  <div className="flex flex-wrap gap-4">
                    {["18:30", "19:15", "19:45", "21:50", "23:20", "23:55"].map(
                      (time) => (
                        <button
                          key={time}
                          className="px-4 py-2 bg-gray-700 hover:bg-yellow-500 rounded transition-colors"
                        >
                          {time}
                        </button>
                      )
                    )}
                  </div>
                </div>

                <div>
                  <div className="text-xl text-gray-400 mb-2">DELUXE</div>
                  <div className="flex flex-wrap gap-2">
                    {["22:45"].map((time) => (
                      <button
                        key={time}
                        className="px-4 py-2 bg-gray-700 hover:bg-yellow-500 rounded transition-colors"
                      >
                        {time}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ShowTimePage;

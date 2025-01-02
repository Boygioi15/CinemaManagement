import { useEffect, useState } from "react";
import FilmCard from "../../Components/filmCard/index";
import axios from "axios";
import { getUpcommingFilms } from "../../config/api";

const FilmUpcoming = () => {
  const [filmShowing, setFilmShowing] = useState([]);

  useEffect(() => {
    document.title = "Phim sắp chiếu";
    const fetchFilmShowing = async () => {
      try {
        const response = await getUpcommingFilms();
        if (response && response.data) {
          setFilmShowing(response.data);
        }
      } catch {
        throw new Error("There is an error while getting film detail");
      }
    };
    fetchFilmShowing();
  }, []);

  if (!filmShowing || filmShowing.length === 0) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex flex-col justify-center items-center gap-20 py-20">
      <h1 className="font-interExtraBold">PHIM SẮP CHIẾU</h1>
      <div className="flex flex-wrap justify-center items-center gap-4 md:gap-12">
        {filmShowing.map((film) => (
          <FilmCard
            key={film._id}
            filmId={film._id}
            imageUrl={film.thumbnailURL || ""}
            name={film.name || "Không có tên"}
            country={film.originatedCountry || "Không rõ"}
            type={"Chưa xác định"} // Bạn có thể thêm trường 'type' vào data trả về nếu có
            duration={film.filmDuration || 0}
            ageLimit={film.ageRestriction || "Không rõ"}
            voice={film.voice || "Không rõ"}
            trailerURL={film.trailerURL}
            twoDthreeD={film.twoDthreeD}
            isShowing={true} // Nếu cần điều kiện khác, hãy cập nhật logic này
          />
        ))}
      </div>
    </div>
  );
};

export default FilmUpcoming;

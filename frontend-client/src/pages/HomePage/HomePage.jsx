import { useEffect, useState } from "react";

import QuickBooking from "../../Components/homePage/QuickBooking";

import { getShowingFilms, getUpcommingFilms } from "../../config/api";
import FilmListSection from "../../Components/homePage/FilmListSection";
import { useNavigate } from "react-router-dom";

const HomePage = () => {
  const [filmShowing, setFilmShowing] = useState([]);
  const [upcomingFilm, setUpcomingFilm] = useState([]);
  const navigate = useNavigate();
  useEffect(() => {
    const fetchFilmShowing = async () => {
      try {
        const response = await getShowingFilms();
        if (response && response.data) {
          console.log("🚀 ~ fetchFilmShowing ~ response:", response);
          setFilmShowing(response.data);
        }
      } catch {
        throw new Error("There is an error while getting film detail");
      }
    };
    const fetchFilmUpcoming = async () => {
      try {
        const response = await getUpcommingFilms();
        if (response && response.data) {
          setUpcomingFilm(response.data);
        }
      } catch {
        throw new Error("There is an error while getting film detail");
      }
    };
    fetchFilmUpcoming();
    fetchFilmShowing();
  }, []);
  const handleOnClickSeeMoreInShowing = () => {
    navigate("/movie/showing");
  };
  const handleOnClickSeeMoreInUpComing = () => {
    navigate("/movie/upcoming");
  };
  return (
    <>
      <div className="container mx-auto px-4 md:px-6 lg:px-8 py-6 max-w-7xl">
        <img
          src="https://api-website.cinestar.com.vn/media/MageINIC/bannerslider/bap-nuoc-onl.jpg"
          alt="Movie Banner"
          className="w-full h-full object-cove py-5"
        />

        <QuickBooking />

        {/* Phim đang chiếu */}

        <FilmListSection
          title="PHIM ĐANG CHIẾU "
          filmList={filmShowing}
          onCLickSeeMore={handleOnClickSeeMoreInShowing}
        />
        <FilmListSection
          title="PHIM SẮP CHIẾU "
          filmList={upcomingFilm}
          onCLickSeeMore={handleOnClickSeeMoreInUpComing}
        />
      </div>
    </>
  );
};

export default HomePage;

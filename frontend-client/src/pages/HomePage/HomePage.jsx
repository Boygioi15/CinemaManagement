import { useEffect, useState } from "react";

import QuickBooking from "../../Components/homePage/QuickBooking";

import { getShowingFilms, getUpcommingFilms } from "../../config/api";
import FilmListSection from "../../Components/homePage/FilmListSection";

const HomePage = () => {
  const [filmShowing, setFilmShowing] = useState([]);
  const [upcomingFilm, setUpcomingFilm] = useState([]);

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

        <FilmListSection title="PHIM ĐANG CHIẾU " filmList={filmShowing} />
        <FilmListSection title="PHIM SẮP CHIẾU " filmList={upcomingFilm} />
      </div>
    </>
  );
};

export default HomePage;

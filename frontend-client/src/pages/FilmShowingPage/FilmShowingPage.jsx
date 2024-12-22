import FilmCard from "../../Components/filmCard/index";

const FilmShowingPage = () => {
  return (
    <div className="flex flex-col justify-center items-center gap-20 py-20">
    <h1 className="font-interExtraBold">PHIM ĐANG CHIẾU</h1>
      <div className="flex flex-wrap justify-center items-center gap-4 md:gap-12">
        <FilmCard
          imageUrl={
            "https://cinestar.com.vn/_next/image/?url=https%3A%2F%2Fapi-website.cinestar.com.vn%2Fmedia%2Fwysiwyg%2FPosters%2F12-2024%2Fchi-dau.png&w=640&q=50"
          }
          name={"Chị Dâu"}
          country={"Việt Nam"}
          type={"Hành động"}
          duration={120}
          ageLimit={13}
          isShowing={true}
        />
         <FilmCard
          imageUrl={
            "https://cinestar.com.vn/_next/image/?url=https%3A%2F%2Fapi-website.cinestar.com.vn%2Fmedia%2Fwysiwyg%2FPosters%2F12-2024%2Fchi-dau.png&w=640&q=50"
          }
          name={"Chị Dâu"}
          country={"Việt Nam"}
          type={"Hành động"}
          duration={120}
          ageLimit={13}
          isShowing={true}
        />
         <FilmCard
          imageUrl={
            "https://cinestar.com.vn/_next/image/?url=https%3A%2F%2Fapi-website.cinestar.com.vn%2Fmedia%2Fwysiwyg%2FPosters%2F12-2024%2Fchi-dau.png&w=640&q=50"
          }
          name={"Chị Dâu"}
          country={"Việt Nam"}
          type={"Hành động"}
          duration={120}
          ageLimit={13}
          isShowing={true}
        />
         <FilmCard
          imageUrl={
            "https://cinestar.com.vn/_next/image/?url=https%3A%2F%2Fapi-website.cinestar.com.vn%2Fmedia%2Fwysiwyg%2FPosters%2F12-2024%2Fchi-dau.png&w=640&q=50"
          }
          name={"Chị Dâu"}
          country={"Việt Nam"}
          type={"Hành động"}
          duration={120}
          ageLimit={13}
          isShowing={true}
        />
         <FilmCard
          imageUrl={
            "https://cinestar.com.vn/_next/image/?url=https%3A%2F%2Fapi-website.cinestar.com.vn%2Fmedia%2Fwysiwyg%2FPosters%2F12-2024%2Fchi-dau.png&w=640&q=50"
          }
          name={"Chị Dâu"}
          country={"Việt Nam"}
          type={"Hành động"}
          duration={120}
          ageLimit={13}
          isShowing={true}
        />

      </div>
    </div>
  );
};
export default FilmShowingPage;

import "./style.css";
import logoTag from "../../assets/bookmark--bookmarks-tags-favorite.png";
import logoTime from "../../assets/fastforward-clock--time-clock-reset-stopwatch-circle-measure-loading.png";
import logoEarth from "../../assets/earth-1--planet-earth-globe-world.png";
const GeneralFilmCard = ({
  imageUrl,
  name,
  country,
  type,
  duration,
  ageLimit,
}) => {
  return (
    <div className="film-card">
      <img
        src="https://cinestar.com.vn/_next/image/?url=https%3A%2F%2Fapi-website.cinestar.com.vn%2Fmedia%2Fwysiwyg%2FPosters%2F11-2024%2Fcong-chua-noi-loan.jpg&w=1080&q=50"
        alt={name}
        className="film-card-image"
      />
      <div className="film-card-overlay">
        <div className="film-card-content">
          <h3 className="film-card-title">
            {name} CÔNG CHÚA NỔI LOẠN: NHIỆM VỤ GIẢI CỨU HOÀNG GIA (P){" "}
            {ageLimit}
          </h3>
          <p>
            <img
              src={logoTag}
              alt="Tag Icon"
              style={{
                width: "16px",
                height: "16px",
                marginRight: "8px",
                verticalAlign: "middle",
              }}
            />
            Thể loại
            {type}
          </p>
          <p>
            <img
              src={logoTime}
              alt="Tag Icon"
              style={{
                width: "16px",
                height: "16px",
                marginRight: "8px",
                verticalAlign: "middle",
              }}
            />
            {duration} Thời lượng
          </p>
          <p>
            <img
              src={logoEarth}
              alt="Tag Icon"
              style={{
                width: "16px",
                height: "16px",
                marginRight: "8px",
                verticalAlign: "middle",
              }}
            />
            {country} Quốc gia
          </p>
        </div>
      </div>
    </div>
  );
};

export default GeneralFilmCard;

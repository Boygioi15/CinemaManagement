import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import "./index.css";
import FilmCard from './components/filmCard';

// Dữ liệu giả lập
const filmData = [
  {
    id: 1,
    imageUrl:
      "https://cinestar.com.vn/_next/image/?url=https%3A%2F%2Fapi-website.cinestar.com.vn%2Fmedia%2Fwysiwyg%2FPosters%2F11-2024%2Fcong-chua-noi-loan.jpg&w=1080&q=50",
    name: "Công Chúa Nổi Loạn",
    country: "Mỹ",
    type: "Hoạt hình",
    duration: "95 phút",
    ageLimit: "13",
  },
  {
    id: 2,
    imageUrl:
      "https://cinestar.com.vn/_next/image/?url=https%3A%2F%2Fapi-website.cinestar.com.vn%2Fmedia%2Fwysiwyg%2FPosters%2F11-2024%2Fmeo-nam.jpg&w=1080&q=50",
    name: "Mèo Nham Hiểm",
    country: "Anh",
    type: "Phiêu lưu",
    duration: "100 phút",
    ageLimit: "16",
  },
  {
    id: 3,
    imageUrl:
      "https://cinestar.com.vn/_next/image/?url=https%3A%2F%2Fapi-website.cinestar.com.vn%2Fmedia%2Fwysiwyg%2FPosters%2F11-2024%2Fnguoi-nhen.jpg&w=1080&q=50",
    name: "Người Nhện: Vũ Trụ Mới",
    country: "Mỹ",
    type: "Hành động",
    duration: "120 phút",
    ageLimit: "18",
  },
  {
    id: 4,
    imageUrl:
      "https://cinestar.com.vn/_next/image/?url=https%3A%2F%2Fapi-website.cinestar.com.vn%2Fmedia%2Fwysiwyg%2FPosters%2F11-2024%2Fhanh-tinh-la.jpg&w=1080&q=50",
    name: "Hành Tinh Lạ",
    country: "Canada",
    type: "Khoa học viễn tưởng",
    duration: "110 phút",
    ageLimit: "13",
  },
];

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 p-4 bg-slate-700">
      {/* Hiển thị các thẻ phim */}
      {filmData.map((film) => (
        <FilmCard
          key={film.id}
          imageUrl={film.imageUrl}
          name={film.name}
          country={film.country}
          type={film.type}
          duration={film.duration}
          ageLimit={film.ageLimit}
        />
      ))}
    </div>
  </StrictMode>
);

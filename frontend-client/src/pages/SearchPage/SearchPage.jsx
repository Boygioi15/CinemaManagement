import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { searchFilm } from "../../config/api";
import FilmCard from "../../Components/filmCard";

const SearchPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [films, setFilms] = useState([]);
  const [metadata, setMetadata] = useState({
    total: 0,
    currentPage: 1,
    totalPages: 0,
    limit: 8,
  });

  useEffect(() => {
    document.title = "Tìm kiếm";
    const keyword = searchParams.get("keyword");
    const page = parseInt(searchParams.get("page")) || 1;
    handleSearch(keyword, page);
  }, [searchParams]);

  const handleSearch = async (keyword, page = 1) => {
    const response = await searchFilm({ keyword, page });
    if (response.success) {
      setFilms(response.data.films);
      setMetadata(response.data.metadata);
    }
  };

  const handlePageChange = (newPage) => {
    setSearchParams((prev) => {
      prev.set("page", newPage);
      return prev;
    });
  };

  // Hàm tạo mảng trang hiển thị với dấu ...
  const getPageNumbers = () => {
    const totalPages = metadata.totalPages;
    const currentPage = metadata.currentPage;
    const pageNumbers = [];

    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    // Luôn hiển thị trang 1
    pageNumbers.push(1);

    // Xử lý phần giữa
    if (currentPage <= 3) {
      pageNumbers.push(2, 3, 4, "...", totalPages);
    } else if (currentPage >= totalPages - 2) {
      pageNumbers.push(
        "...",
        totalPages - 3,
        totalPages - 2,
        totalPages - 1,
        totalPages
      );
    } else {
      pageNumbers.push(
        "...",
        currentPage - 1,
        currentPage,
        currentPage + 1,
        "...",
        totalPages
      );
    }

    return pageNumbers;
  };

  return (
    <>
      <div className="flex flex-col justify-center items-center gap-20 py-20 min-h-[800px]">
        {films.length === 0 && <div>Không có phim nào phù hợp</div>}
        {films.length > 0 && (
          <>
            <h1 className="font-interExtraBold">Kết quả tìm kiếm</h1>
            <div className="flex flex-wrap justify-center items-center gap-4 md:gap-12">
              {films.map((film) => (
                <FilmCard
                  key={film._id}
                  filmId={film._id}
                  imageUrl={film.thumbnailURL || ""}
                  name={film.name || "Không có tên"}
                  country={film.originatedCountry || "Không rõ"}
                  type={"Chưa xác định"}
                  duration={film.filmDuration || 0}
                  ageLimit={film.ageRestriction || "Không rõ"}
                  voice={film.voice || "Không rõ"}
                  trailerURL={film.trailerURL}
                  twoDthreeD={film.twoDthreeD}
                  isShowing={true}
                />
              ))}
            </div>

            {/* Styled Pagination */}
            {metadata.totalPages > 1 && (
              <div className="flex items-center justify-center space-x-2 mt-8">
                {/* Nút Previous */}
                <button
                  onClick={() => handlePageChange(metadata.currentPage - 1)}
                  disabled={metadata.currentPage === 1}
                  className={`flex items-center px-4 py-2 text-sm font-medium rounded-md 
                    ${
                      metadata.currentPage === 1
                        ? "text-gray-400 bg-gray-100 cursor-not-allowed"
                        : "text-gray-700 bg-white hover:bg-gray-50 border border-gray-300"
                    } transition-colors duration-150`}
                >
                  <svg
                    className="w-5 h-5 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M15 19l-7-7 7-7"
                    />
                  </svg>
                  Trước
                </button>

                {/* Số trang */}
                <div className="hidden md:flex space-x-1">
                  {getPageNumbers().map((pageNumber, index) => (
                    <button
                      key={index}
                      onClick={() =>
                        pageNumber !== "..." && handlePageChange(pageNumber)
                      }
                      disabled={pageNumber === "..."}
                      className={`px-4 py-2 text-sm font-medium rounded-md transition-colors duration-150
                        ${
                          pageNumber === metadata.currentPage
                            ? "bg-blue-600 text-white"
                            : pageNumber === "..."
                            ? "text-gray-700 cursor-default"
                            : "text-gray-700 bg-white hover:bg-gray-50 border border-gray-300"
                        }`}
                    >
                      {pageNumber}
                    </button>
                  ))}
                </div>

                {/* Hiển thị đơn giản cho mobile */}
                <div className="md:hidden text-sm text-gray-700">
                  <span className="font-medium">{metadata.currentPage}</span>
                  <span className="mx-1">/</span>
                  <span>{metadata.totalPages}</span>
                </div>

                {/* Nút Next */}
                <button
                  onClick={() => handlePageChange(metadata.currentPage + 1)}
                  disabled={metadata.currentPage === metadata.totalPages}
                  className={`flex items-center px-4 py-2 text-sm font-medium rounded-md
                    ${
                      metadata.currentPage === metadata.totalPages
                        ? "text-gray-400 bg-gray-100 cursor-not-allowed"
                        : "text-gray-700 bg-white hover:bg-gray-50 border border-gray-300"
                    } transition-colors duration-150`}
                >
                  Sau
                  <svg
                    className="w-5 h-5 ml-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
};

export default SearchPage;

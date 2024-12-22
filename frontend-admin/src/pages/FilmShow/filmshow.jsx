import { useState, useEffect } from "react";
import Table from "../../components/Table";
import { FiEdit2, FiTrash2 } from "react-icons/fi";
import FilmShowModal from "../../components/Filmshow/FilmShowModal";
import { BiRefresh } from "react-icons/bi";
import DatePicker from "react-datepicker";
import axios from "axios";

const FilmShow = () => {
  const [tableSearchQuery, setTableSearchQuery] = useState("");
  const [filmNameQuery, setFilmNameQuery] = useState("");
  const [countryQuery, setCountryQuery] = useState("");
  const [ageRestriction, setAgeRestriction] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0] // Định dạng yyyy-mm-dd
  );

  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [mode, setMode] = useState("add");
  const [filmshows, setFilmShows] = useState([]);

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchFilmShows = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8000/api/film-show/getAll"
        );
        const data = response.data.data;
        console.log(data);

        const processedData = await Promise.all(
          data.map(async (show) => {
            // Lấy tên phim
            const filmRes = await axios.get(
              `http://localhost:8000/api/films/${show.film}/getFilmDetail`
            );
            const filmName = filmRes.data.data.name;

            // Lấy tên phòng
            const roomRes = await axios.get(
              `http://localhost:8000/api/rooms/${show.roomId}`
            );
            const roomName = roomRes.data.data.roomName;

            //Láy ghế
            const seatList = await Promise.all(
              show.lockedSeatIds.map(async (seatId) => {
                const seatResponse = await axios.get(
                  `http://localhost:8000/api/seats/${seatId}`
                );
                const fullSeatName = `${seatResponse.data.data.seatName}${seatResponse.data.data.seatRow}${seatResponse.data.data.seatCol}`;
                return fullSeatName; // Ví dụ trả về tên ghế
              })
            );
            // Xử lý dữ liệu để hiển thị
            return {
              ...show,
              film: filmName,
              showDate: new Date(show.showDate).toLocaleDateString("vi-VN"),
              room: roomName,
              seatList: seatList.join(", "),
            };
          })
        );

        setFilmShows(processedData);
      } catch (error) {
        console.error("Lỗi khi tải dữ liệu:", error);
      }
    };

    fetchFilmShows();
  }, []);

  // Gọi API khi component được render lần đầu

  const handleEditClick = (item) => {
    setSelectedItem(item);
    setMode("edit");
    setIsDetailModalOpen(true);
  };

  const handleAddClick = () => {
    setMode("add");
    setSelectedItem(null);
    setIsDetailModalOpen(true);
  };

  const handleEditConfirm = (item) => {
    console.log(`Lấy được data:${item.name} `);
    setIsDetailModalOpen(false);
  };

  const handleRefresh = async () => {
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
    }, 2000);
  };

  const columns = [
    { header: "Tên phim", key: "film" },
    { header: "Ngày chiếu", key: "showDate" },
    { header: "Suất chiếu", key: "showTime" },
    { header: "Phòng", key: "room" },
    { header: "Ghế đã đặt", key: "seatList" },
    {
      header: "Trạng thái",
      key: "status",
      render: (_, row) => {
        let statusText = "";
        let statusClass = "";

        if (row.invalidReason_Printed) {
          statusText = "Từ chối in vé";
          statusClass = "bg-red-100 text-red-800";
        } else if (row.invalidReason_Served) {
          statusText = "Từ chối phục vụ";
          statusClass = "bg-red-100 text-red-800";
        } else if (!row.printed) {
          statusText = "Chưa in";
          statusClass = "bg-yellow-100 text-yellow-800";
        } else if (row.served) {
          statusText = "Đã phục vụ";
          statusClass = "bg-green-100 text-green-800";
        } else if (row.printed) {
          statusText = "Đã in";
          statusClass = "bg-blue-100 text-blue-800";
        }

        return (
          <span className={`px-2 py-1 rounded-full text-xs ${statusClass}`}>
            {statusText}
          </span>
        );
      },
    },
    {
      header: "Hành động",
      key: "actions",
      render: (_, row) => (
        <div className="flex space-x-3">
          <button
            className="text-blue-600 hover:text-blue-800"
            onClick={() => handleEditClick(row)}
          >
            <FiEdit2 className="w-4 h-4" />
          </button>
          <button className="text-red-600 hover:text-red-800">
            <FiTrash2 className="w-4 h-4" />
          </button>
        </div>
      ),
    },
  ];
  const itemsPerPage = 6;

  // const filteredData = filmshows.filter(
  //   (filmshows) =>
  //     filmshows.name.toLowerCase().includes(tableSearchQuery.toLowerCase()) ||
  //     filmshows.email.toLowerCase().includes(tableSearchQuery.toLowerCase()) ||
  //     filmshows.role.toLowerCase().includes(tableSearchQuery.toLowerCase())
  // );

  const totalPages = Math.ceil(filmshows.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = filmshows.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div>
      <div className="mb-6 flex justify-between items-center pr-10">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Thông tin suất chiếu
          </h2>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4 justify-between">
              <button
                onClick={handleRefresh}
                className="r p-4 rounded-full hover:bg-gray-100 transition-all duration-300"
                disabled={loading}
              >
                <BiRefresh
                  className={`text-4xl text-black hover:text-black ${
                    loading
                      ? "animate-spin"
                      : "hover:rotate-180 transition-transform duration-300"
                  }`}
                />
              </button>
              <div className="flex items-center w-[300px]">
                <input
                  type="text"
                  placeholder="Tên phim...."
                  value={filmNameQuery}
                  onChange={(e) => setFilmNameQuery(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg focus:outline-none border"
                />
              </div>
              <DatePicker
                selected={selectedDate}
                onChange={(date) => {
                  const formattedDate = new Date(date)
                    .toISOString()
                    .split("T")[0]; // Định dạng yyyy-mm-dd
                  setSelectedDate(formattedDate);
                }}
                className="p-2 border rounded-md"
              />
              <div className="flex items-center w-[300px]">
                <select
                  name="age"
                  value={ageRestriction}
                  onChange={(e) => setAgeRestriction(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="" disabled>
                    <span className="text-gray-400">Trạng thái</span>
                  </option>
                  <option value="all">Tất cả</option>
                  <option value="all">Đã hủy</option>
                  <option value="all">Đã chiếu</option>
                  <option value="all">Chưa chiếu</option>
                  <option value="all">Đang chiếu</option>
                </select>
              </div>
            </div>
            <button
              className="ml-20 px-4 py-2 bg-black text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
              onClick={() => handleAddClick()}
            >
              Suất phim mới +
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm overflow-x-auto">
        <Table columns={columns} data={paginatedData} />

        <div className="flex items-center justify-between px-6 py-4 bg-gray-50">
          <button
            onClick={() => setCurrentPage(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-4 py-2 text-sm text-gray-600 bg-white rounded-lg shadow-sm disabled:opacity-50"
          >
            Previous
          </button>
          <span className="text-sm text-gray-600">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-4 py-2 text-sm text-gray-600 bg-white rounded-lg shadow-sm disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>

      <FilmShowModal
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
      />
    </div>
  );
};

export default FilmShow;

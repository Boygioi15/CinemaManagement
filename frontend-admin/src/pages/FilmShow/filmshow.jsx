import { useState, useEffect } from "react";
import Table from "../../components/Table";
import { FiSearch } from "react-icons/fi";
import { TbCancel } from "react-icons/tb";
import FilmShowModal from "../../components/Filmshow/FilmShowModal";
import ViewModal from "../../components/Filmshow/Detail";
import RefreshLoader from "../../components/Loading";
import { BiRefresh } from "react-icons/bi";
import DatePicker from "react-datepicker";
import axios from "axios";

const FilmShow = () => {
  const [filmNameQuery, setFilmNameQuery] = useState("");
  const [statusQuery, setStatusQuery] = useState("");
  const [selectedDate, setSelectedDate] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);

  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [mode, setMode] = useState("add");
  const [filmshows, setFilmShows] = useState([]);

  const [loading, setLoading] = useState(false);

  const fetchFilmShows = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8000/api/film-show/getAll"
      );
      const data = response.data.data;

      const now = new Date();
      const processedData = await Promise.all(
        data.map(async (show) => {
          // Lấy tên phim
          const filmRes = await axios.get(
            `http://localhost:8000/api/films/${show.film}/getFilmDetail`
          );
          const filmName = filmRes.data.data.name;
          const duration = filmRes.data.data.filmDuration;
          // Lấy tên phòng
          const roomRes = await axios.get(
            `http://localhost:8000/api/rooms/${show.roomId}`
          );
          const roomName = roomRes.data.data.roomName;

          // Xử lý dữ liệu để hiển thị
          const showDate = new Date(show.showDate); // Ngày chiếu

          //xử lí lệch múi giờ
          const timeZoneOffset = showDate.getTimezoneOffset() * 60000; // Chênh lệch múi giờ tính bằng ms
          const localShowDate = new Date(showDate.getTime() - timeZoneOffset);

          //gán giwof và phút vào date
          const [hours, minutes] = show.showTime.split(":");
          localShowDate.setHours(hours, minutes); // Gán giờ và phút vào showDate

          //thười gian kết thúc
          const endTime = new Date(localShowDate.getTime() + duration * 60000);

          let status = "Chưa chiếu";

          if (now < localShowDate) {
            // Trước giờ chiếu
            status = "Chưa chiếu";
          } else if (now <= endTime) {
            // Đang chiếu (trong khoảng thời gian chiếu phim)
            status = "Đang chiếu";
          } else {
            // Sau giờ chiếu + thời lượng
            status = "Đã chiếu";
          }

          return {
            ...show,
            film: filmName,
            showDate: new Date(show.showDate).toLocaleDateString("vi-VN"),
            room: roomName,
            status: status,
            //  seatList: seatList.join(", "),
          };
        })
      );

      setFilmShows(processedData);
    } catch (error) {
      console.error("Lỗi khi tải dữ liệu:", error);
    }
  };

  useEffect(() => {
    fetchFilmShows();
  }, []);

  // Gọi API khi component được render lần đầu

  const handleViewClick = (item) => {
    setSelectedItem(item);
    setIsDetailModalOpen(true);
  };

  const handleAddClick = () => {
    setSelectedItem(null);
    setIsAddModalOpen(true);
  };

  const handleRefresh = async () => {
    setLoading(true);
    fetchFilmShows();
    setTimeout(() => {
      setLoading(false);
    }, 2000);
  };

  const columns = [
    { header: "Tên phim", key: "film" },
    { header: "Ngày chiếu", key: "showDate" },
    { header: "Suất chiếu", key: "showTime" },
    { header: "Phòng", key: "room" },
    {
      header: "Trạng thái",
      key: "status",
      render: (_, row) => {
        let statusClass = "";
        let statusText = row.status; // Đảm bảo `rowData.status` có giá trị hợp lệ

        // Kiểm tra giá trị status và gán class tương ứng
        switch (row.status) {
          case "Chưa chiếu":
            statusClass = "bg-yellow-100 text-yellow-800"; // Màu vàng
            break;
          case "Đã hủy":
            statusClass = "bg-red-100 text-red-800"; // Màu đỏ
            break;
          case "Đã chiếu":
            statusClass = "bg-green-100 text-green-800"; // Màu xanh
            break;
          case "Đang chiếu":
            statusClass = "bg-blue-100 text-blue-800"; // Màu xanh dương
            break;
          default:
            statusClass = "bg-gray-100 text-gray-800"; // Màu mặc định
            break;
        }

        return (
          <span
            className={`inline-block px-3 py-1 rounded-full ${statusClass}`}
          >
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
            onClick={() => handleViewClick(row)}
          >
            <FiSearch className="w-4 h-4" />
          </button>
          <button className="text-red-600 hover:text-red-800">
            <TbCancel className="w-4 h-4" />
          </button>
        </div>
      ),
    },
  ];
  const itemsPerPage = 6;

  const filteredData = filmshows.filter((item) => {
    const matchesName = filmNameQuery
      ? item.film.toLowerCase().includes(filmNameQuery.toLowerCase())
      : true;

    const matchesDate = selectedDate
      ? item.showDate === new Date(selectedDate).toLocaleDateString()
      : true; // Nếu không có ngày chọn thì không lọc theo ngày

    const matchesStatus =
      statusQuery === "" ||
      statusQuery === "all" ||
      item.status === statusQuery;

    return matchesName && matchesDate && matchesStatus;
  });

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = filteredData.slice(
    startIndex,
    startIndex + itemsPerPage
  );

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
              {/* <DatePicker
                selected={selectedDate}
                onChange={(date) => {
                  const offset = date.getTimezoneOffset() * 60000; // Lấy chênh lệch múi giờ
                  const localDate = new Date(date.getTime() - offset) // Chuyển đổi về local time
                    .toISOString()
                    .split("T")[0]; // yyyy-mm-dd
                  setSelectedDate(localDate);
                }}
                className="p-2 border rounded-md"
              /> */}
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => {
                  const localDate = e.target.value; // Lấy trực tiếp giá trị yyyy-mm-dd
                  setSelectedDate(localDate); // Cập nhật state
                }}
                className="p-2 border rounded-md"
              />
              <div className="flex items-center w-[300px]">
                <select
                  name="age"
                  value={statusQuery}
                  onChange={(e) => setStatusQuery(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="" disabled>
                    <span className="text-gray-400">Trạng thái</span>
                  </option>
                  <option value="all">Tất cả</option>
                  <option value="Đã hủy">Đã hủy</option>
                  <option value="Đã chiếu">Đã chiếu</option>
                  <option value="Chưa chiếu">Chưa chiếu</option>
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
            Trước
          </button>
          <span className="text-sm text-gray-600">
            trang {currentPage} trên {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-4 py-2 text-sm text-gray-600 bg-white rounded-lg shadow-sm disabled:opacity-50"
          >
            Tiếp
          </button>
        </div>
      </div>

      <FilmShowModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAddSuccess={fetchFilmShows}
      />

      <ViewModal
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        filmShowDetail={selectedItem}
      />

      <RefreshLoader isOpen={loading} />
    </div>
  );
};

export default FilmShow;

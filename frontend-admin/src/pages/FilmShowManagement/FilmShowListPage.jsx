import { useState, useEffect, useMemo } from "react";
import Table from "../../components/Table";
import { FiSearch } from "react-icons/fi";
import { TbCancel } from "react-icons/tb";
import { BsSortDown } from "react-icons/bs";
import FilmShowModal from "../../components/Modal/FilmShowModal";
import ViewModal from "../../components/Modal/FilmShow_FilmDetailModal";
import RefreshLoader from "../../components/Loading";
import { BiRefresh } from "react-icons/bi";
import Dialog from "../../components/Dialog/ConfirmDialog";
import SuccessDialog from "../../components/Dialog/SuccessDialog";
import FailedDialog from "../../components/Dialog/FailedDialog";
import axios from "axios";

const FilmShowListPage = () => {
  const [filmNameQuery, setFilmNameQuery] = useState("");
  const [statusQuery, setStatusQuery] = useState("");
  const [selectedDate, setSelectedDate] = useState(null);
  const [roomQuery, setRoomQuery] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const [sortOption, setSortOption] = useState("");

  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [mode, setMode] = useState("add");
  const [filmshows, setFilmShows] = useState([]);
  const [tableData, settableData] = useState([]);
  const [rooms, setRooms] = useState([]);

  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [dialogData, setDialogData] = useState({ title: "", message: "" });
  const [isFailModalOpen, setIsFailModalOpen] = useState(false);

  const [loading, setLoading] = useState(false);

  const handleDeleteFilter = () => {
    setFilmNameQuery("");
    setStatusQuery("");
    setSelectedDate("");
    setRoomQuery("");
  };

  const fetchFilmShows = async () => {
    try {
      setLoading(true);
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
          let filmName = filmRes.data.data.name;

          const twoDthreeD = filmRes.data.data.twoDthreeD; // Giả sử mảng là ['2D', '3D']
          const result = twoDthreeD.join(", ");
          if (show.cancelled === true) {
            console.log("true");

            filmName += " (Đã hủy)"; // Thêm chữ "Đã hủy" vào tên phim
          }

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
            showDate: new Date(show.showDate).toLocaleDateString(),
            room: roomName,
            status: status,
            showType: result,
            //  seatList: seatList.join(", "),
          };
        })
      );

      setFilmShows(processedData);
    } catch (error) {
      console.error("Lỗi khi tải dữ liệu:", error);
    } finally {
      setLoading(false); // End loading when API call is complete
    }
  };

  const fetchRooms = async () => {
    try {
      const response = await axios.get("http://localhost:8000/api/rooms");
      const data = response.data.data;

      setRooms(data);
    } catch (error) {
      console.error("Lỗi khi tải dữ liệu:", error);
    }
  };

  useEffect(() => {
    fetchFilmShows();
    fetchRooms();
  }, []);

  // Gọi API khi component được render lần đầu

  const handleViewClick = (item) => {
    setSelectedItem(item);
    setIsDetailModalOpen(true);
  };

  const handleDelete = (item) => {
    setSelectedItem(item);
    setDialogData({
      title: "Xác nhận xóa",
      message: "Bạn chắc chắn muốn xóa suất phim này chứ?",
    });
    setIsConfirmModalOpen(true);
  };

  const handleConfirmClick = async () => {
    setLoading(true);
    console.log(selectedItem);

    try {
      await axios.post(
        `http://localhost:8000/api/film-show/cancel-filmShow/${selectedItem._id}`
      );

      await handleRefresh(); // Làm mới dữ liệu sau khi thành công
      // Hiển thị thông báo thành công
      setDialogData({
        title: "Thành công",
        message: "Xóa suất phim thành công!",
      });
      setIsSuccessModalOpen(true);
    } catch (error) {
      console.error("Error:", error);
      alert("Thao tác thất bại, lỗi: " + error.response.data.msg);
    } finally {
      setTimeout(() => {
        setLoading(false);
      }, 2000);
      setIsConfirmModalOpen(false);
    }
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
          {!row.cancelled && (
            <button
              className="text-red-600 hover:text-red-800"
              onClick={() => handleDelete(row)}
            >
              <TbCancel className="w-4 h-4" />
            </button>
          )}
        </div>
      ),
    },
  ];
  const itemsPerPage = 6;

  const filteredData = useMemo(() => {
    let filtered = filmshows.filter((item) => {
      const matchesName = filmNameQuery
        ? item.film.toLowerCase().includes(filmNameQuery.toLowerCase())
        : true;

      const matchesDate = selectedDate
        ? item.showDate === new Date(selectedDate).toLocaleDateString()
        : true;

      const matchesStatus =
        statusQuery === "" ||
        statusQuery === "all" ||
        item.status === statusQuery;

      const matchesRoom =
        roomQuery === "" || roomQuery === "all" || item.room === roomQuery;

      return matchesName && matchesDate && matchesStatus && matchesRoom;
    });

    if (sortOption === "Theo ngày") {
      filtered = filtered.sort((a, b) => {
        const dateA = new Date(a.showDate.split("/").reverse().join("-")); // Đổi thành "yyyy-mm-dd"
        const dateB = new Date(b.showDate.split("/").reverse().join("-"));
        return dateA - dateB; // So sánh ngày tăng dần
      });
    } else if (sortOption === "Theo giờ") {
      filtered = filtered.sort((a, b) => {
        return (
          new Date(`2023-01-01 ${a.showTime}`) -
          new Date(`2023-01-01 ${b.showTime}`)
        );
      });
    }

    return filtered;
  }, [
    filmshows,
    filmNameQuery,
    selectedDate,
    statusQuery,
    roomQuery,
    sortOption,
  ]);

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
          <div className="flex items-center ">
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
              <h1 className="text-xl font-bold text-gray-800 ">Lọc:</h1>
              <div className="flex items-center w-[250px]">
                <input
                  type="text"
                  placeholder="Tên phim...."
                  value={filmNameQuery}
                  onChange={(e) => setFilmNameQuery(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg focus:outline-none border"
                />
              </div>

              <input
                type="date"
                value={selectedDate}
                onChange={(e) => {
                  const localDate = e.target.value; // Lấy trực tiếp giá trị yyyy-mm-dd
                  setSelectedDate(localDate); // Cập nhật state
                }}
                className="p-2 border rounded-md"
              />
              <div className="flex items-center w-[200px]">
                <select
                  name="age"
                  value={roomQuery}
                  onChange={(e) => setRoomQuery(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="" disabled>
                    <span className="text-gray-400">Phòng chiếu</span>
                  </option>
                  <option value="all">Tất cả</option>
                  {rooms.map((room) => (
                    <option key={room._id} value={room.roomName}>
                      {`${room.roomName}`}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex items-center w-[200px]">
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
              className="ml-4 px-4 py-2 text-gray-600 bg-gray-300 rounded-lg hover:bg-gray-400"
              onClick={() => handleDeleteFilter()}
            >
              Xóa lọc
            </button>
            <button
              className="ml-10 px-4 py-2 bg-black text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
              onClick={() => handleAddClick()}
            >
              Suất phim mới +
            </button>
          </div>
          <div className="flex items-center justify-between ml-20 w-full">
            <div className="flex items-center gap-4 justify-between">
              <span className="text-xl font-bold text-gray-800 ">Sắp xếp:</span>
              <div className=" flex items-center w-[200px] ">
                <select
                  value={sortOption}
                  onChange={(e) => setSortOption(e.target.value)}
                  className="block appearance-none w-full bg-white border border-gray-300 hover:border-gray-400 px-4 py-2 pr-8 rounded-lg leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Không sắp xếp</option>
                  {!selectedDate && (
                    <option value="Theo ngày">Theo ngày</option>
                  )}
                  {selectedDate && <option value="Theo giờ">Theo giờ</option>}
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm overflow-x-auto">
        <Table columns={columns} data={paginatedData} />

        {filmshows.length > 0 && (
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
        )}
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

      <Dialog
        isOpen={isConfirmModalOpen}
        title={dialogData.title}
        message={dialogData.message}
        onClose={() => {
          setIsConfirmModalOpen(false);
        }}
        onConfirm={handleConfirmClick}
      />

      <SuccessDialog
        isOpen={!loading && isSuccessModalOpen}
        title={dialogData.title}
        message={dialogData.message}
        onClose={() => {
          setIsSuccessModalOpen(false);
        }}
      />

      <FailedDialog
        isOpen={!loading && isFailModalOpen}
        title={dialogData.title}
        message={dialogData.message}
        onClose={() => {
          setIsFailModalOpen(false);
        }}
      />

      <RefreshLoader isOpen={loading} />
    </div>
  );
};

export default FilmShowListPage;

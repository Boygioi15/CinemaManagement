import React, { useState, useEffect } from "react";
import {
  FaFilm,
  FaFileExport,
  FaShopify,
  FaCreditCard,
  FaUtensils,
} from "react-icons/fa";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import LineChartComponent from "../../components/Statistic/ColumnChart";
import PieCharts from "../../components/Statistic/PieChart";
import axios from "axios";

const StatisticPage = () => {
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0] // Định dạng yyyy-mm-dd
  );
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [ticketTypeData, setTicketTypeData] = useState([]);
  const [ticketMovieData, setTicketMovieData] = useState([]);
  const [itemData, setItemData] = useState([]);

  const [revenueDataByYear, setRevenueDataByYear] = useState({});

  const [statistics, setStatistics] = useState({
    totalNetRevenue: 0,
    totalEffectiveRevenue: 0,
    totalTicketRevenue: 0,
    totalOtherItemsRevenue: 0,
  });

  //biểu đồ loại vé
  const fetchticketType = async (day) => {
    try {
      const response = await axios.get(
        `http://localhost:8000/api/statistics/ticket-category-rate?selectedDate=${day}`
      );

      const data = response.data;
      const transformedData = data.map((item) => ({
        name: item.name,
        value: item.totalRevenue,
      }));
      setTicketTypeData(transformedData);
    } catch (error) {
      alert("Thao tác thất bại, lỗi: " + error.response.data.msg);
    }
  };

  //biểu đồ phim
  const fetchticketMovie = async (day) => {
    try {
      const response = await axios.get(
        `http://localhost:8000/api/statistics/ticket-rate-by-film?selectedDate=${day}`
      );

      const data = response.data;
      const transformedData = data.map((item) => ({
        name: item.filmName,
        value: item.totalTickets,
      }));

      setTicketMovieData(transformedData);
    } catch (error) {
      alert("Thao tác thất bại, lỗi: " + error.response.data.msg);
    }
  };

  //biểu đồ snar phẩm kahcs
  const fetchadditionalItem = async (day) => {
    try {
      const response = await axios.get(
        `http://localhost:8000/api/statistics/additional-items-rate?selectedDate=${day}`
      );

      const data = response.data;
      const transformedData = data.map((item) => ({
        name: item.name,
        value: item.totalRevenue,
      }));
      setItemData(transformedData);
    } catch (error) {
      alert("Thao tác thất bại, lỗi: " + error.response.data.msg);
    }
  };

  const fetchView = async (day) => {
    try {
      const response = await axios.get(
        `http://localhost:8000/api/statistics/daily-statistic?selectedDate=${day}`
      );

      const data = response.data;
      setStatistics((prev) => ({
        ...prev, // Giữ lại các giá trị cũ
        totalNetRevenue: data.totalNetRevenue,
        totalEffectiveRevenue: data.totalEffectiveRevenue,
        totalTicketRevenue: data.totalTicketRevenue,
        totalOtherItemsRevenue: data.totalOtherItemsRevenue,
      }));
    } catch (error) {
      alert("Thao tác thất bại, lỗi: " + error.response.data.msg);
    }
  };

  //vé đã bán
  const fetchTicket = async (day) => {
    try {
      console.log(day);

      const response = await axios.get(
        `http://localhost:8000/api/statistics/ticket-serve-rate?selectedDate=${day}`
      );

      const data = response.data;
      setStatistics((prev) => ({
        ...prev, // Giữ lại các giá trị cũ
        totalTicket: data.servedTickets,
      }));
    } catch (error) {
      alert("Thao tác thất bại, lỗi: " + error.response.data.msg);
    }
  };

  //phim hot nhất nagfy
  const fetchHotFilm = async (day) => {
    try {
      console.log(day);

      const response = await axios.get(
        `http://localhost:8000/api/statistics/hot-movie?selectedDate=${day}`
      );

      const data = response.data;
      setStatistics((prev) => ({
        ...prev, // Giữ lại các giá trị cũ
        hotFilmName: data.filmName,
        hotFilmTotalSeat: data.totalSeats,
      }));
    } catch (error) {
      alert("Thao tác thất bại, lỗi: " + error.response.data.msg);
    }
  };

  //sản phẩm hot nhất nagfy
  const fetchBestSeller = async (day) => {
    try {
      console.log(day);

      const response = await axios.get(
        `http://localhost:8000/api/statistics/best-seller?selectedDate=${day}`
      );

      const data = response.data;
      setStatistics((prev) => ({
        ...prev, // Giữ lại các giá trị cũ
        bestSellerName: data.productName,
        bestSellerTotal: data.totalQuantity,
      }));
    } catch (error) {
      alert("Thao tác thất bại, lỗi: " + error.response.data.msg);
    }
  };

  const fetchData = async (year) => {
    try {
      const response = await axios.get(
        `http://localhost:8000/api/statistics/monthly-statistic?year=${year}`
      );
      const transformedData = transformApiDataToRevenueData(
        response.data,
        year
      );
      setRevenueDataByYear((prev) => ({
        ...prev,
        [year]: transformedData,
      }));
    } catch (error) {
      alert("Thao tác thất bại, lỗi: " + error.response.data.msg);
    }
  };

  useEffect(() => {
    fetchView(selectedDate);
    fetchTicket(selectedDate);
    fetchticketType(selectedDate);
    fetchticketMovie(selectedDate);
    fetchadditionalItem(selectedDate);
    fetchHotFilm(selectedDate);
    fetchBestSeller(selectedDate);
    fetchData(selectedYear);
  }, [selectedDate, selectedYear]);

  const transformApiDataToRevenueData = (apiData, year) => {
    return apiData.map((item) => {
      const { month, totalNetRevenue, totalEffectiveRevenue } = item;
      const monthName = new Date(0, month - 1).toLocaleString("en-US", {
        month: "2-digit",
      });

      return {
        month: monthName,
        thuần: totalNetRevenue,
        thựctế: totalEffectiveRevenue,
      };
    });
  };
  const handleExport = () => {
    const csvData = revenueDataByYear[selectedYear];
    const csvString = [
      ["Month", "Net", "Effective"],
      ...csvData.map((row) => [row.month, row.net, row.effective]),
    ]
      .map((e) => e.join(","))
      .join("\n");

    const blob = new Blob([csvString], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute("download", `revenue-data-${selectedYear}.csv`);
      link.style.visibility = "hidden";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  // console.log(statistics);

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Báo cáo hằng ngày</h1>
        <div className="flex items-center space-x-4">
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => {
              const localDate = e.target.value; // Lấy trực tiếp giá trị yyyy-mm-dd
              setSelectedDate(localDate); // Cập nhật state
              console.log(localDate);
            }}
            className="p-2 border rounded-md"
          />
          {/* <button
            onClick={handleExport}
            className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
          >
            <FaFileExport />
            <span>Export CSV</span>
          </button> */}
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
        <div className="bg-blue-50 p-6 rounded-lg">
          <div className="flex items-center space-x-4">
            <FaFilm className="text-4xl text-blue-600" />
            <div>
              <h3 className="text-lg font-semibold text-gray-800">
                Số vé đã bán ra
              </h3>
              <p className="text-3xl font-bold text-blue-600">
                {statistics.totalTicket}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-blue-50 p-6 rounded-lg">
          <div className="flex items-center space-x-4">
            <FaShopify className="text-4xl text-yellow-600" />
            <div>
              <h3 className="text-lg font-semibold text-gray-800">
                Tổng doanh thu ngày (thuần)
              </h3>
              <p className="text-3xl font-bold text-yellow-600">
                {Number(statistics.totalNetRevenue.toFixed(0)).toLocaleString(
                  "vi-VN"
                )}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-blue-50 p-6 rounded-lg">
          <div className="flex items-center space-x-4">
            <FaShopify className="text-4xl text-yellow-600" />
            <div>
              <h3 className="text-lg font-semibold text-gray-800">
                Tổng doanh thu ngày (thực tế)
              </h3>
              <p className="text-3xl font-bold text-yellow-600">
                {Number(
                  statistics.totalEffectiveRevenue.toFixed(0)
                ).toLocaleString("vi-VN")}
              
              </p>
            </div>
          </div>
        </div>
        <div className="bg-green-50 p-6 rounded-lg">
          <div className="flex items-center space-x-4">
            <FaCreditCard className="text-4xl text-green-600" />
            <div>
              <h3 className="text-lg font-semibold text-gray-800">
                Doanh thu từ vé (thuần)
              </h3>
              <p className="text-3xl font-bold text-green-600">
                {Number(
                  statistics.totalTicketRevenue.toFixed(0)
                ).toLocaleString("vi-VN")}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-purple-50 p-6 rounded-lg">
          <div className="flex items-center space-x-4">
            <FaUtensils className="text-4xl text-purple-600" />
            <div>
              <h3 className="text-lg font-semibold text-gray-800">
                Doanh thu từ các sản phẩm ngoài (thuần)
              </h3>
              <p className="text-3xl font-bold text-purple-600">
                {Number(
                  statistics.totalOtherItemsRevenue.toFixed(0)
                ).toLocaleString("vi-VN")}
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="my-4 text-lg font-medium text-gray-800">
        <p>
          Phim <span className="text-red-600 font-bold">hot</span> nhất ngày:
          <span className="font-bold"> {statistics.hotFilmName}</span> -
          <span> {statistics.hotFilmTotalSeat} ghế đặt.</span>
        </p>
        <p>
          Sản phẩm bán chạy:
          <span className="font-bold"> {statistics.bestSellerName}</span> -
          <span> {statistics.bestSellerTotal} bán ra.</span>
        </p>
      </div>

      <PieCharts
        movieData={ticketMovieData}
        ticketStatusData={itemData}
        ticketTypeData={ticketTypeData}
      />
      <LineChartComponent
        revenueDataByYear={revenueDataByYear}
        selectedYear={selectedYear}
        setSelectedYear={setSelectedYear}
      />
    </div>
  );
};

export default StatisticPage;

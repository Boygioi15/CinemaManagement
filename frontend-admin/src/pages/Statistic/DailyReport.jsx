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
import PieCharts from "../../components/Statistic/PieChart";
import axios from "axios";

const DailyReport = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [ticketTypeData, setTicketTypeData] = useState([]);
  const [ticketMovieData, setTicketMovieData] = useState([]);
  const [itemData, setItemData] = useState([]);

  const fetchticketType = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8000/api/statistics/ticket-category-rate"
      );

      const data = response.data;
      const transformedData = data.map((item) => ({
        name: item.name,
        value: item.totalQuantity,
      }));
      setTicketTypeData(transformedData);
    } catch (error) {
      console.error("Error fetching films:", error);
    }
  };

  const fetchticketMovie = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8000/api/statistics/ticket-rate-by-film"
      );

      const data = response.data;
      const transformedData = data.map((item) => ({
        name: item.filmName,
        value: item.totalTickets,
      }));
      setTicketMovieData(transformedData);
    } catch (error) {
      console.error("Error fetching films:", error);
    }
  };

  const fetchadditionalItem = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8000/api/statistics/additional-items-rate"
      );

      const data = response.data;
      const transformedData = data.map((item) => ({
        name: item.name,
        value: item.totalQuantity,
      }));
      setItemData(transformedData);
    } catch (error) {
      console.error("Error fetching films:", error);
    }
  };

  // Gọi API khi component được render lần đầu
  useEffect(() => {
    fetchticketType();
    fetchticketMovie();
    fetchadditionalItem();
  }, []);

  const statistics = {
    employees: 45,
    movies: 12,
    screenings: 8,
  };

  const handleExport = () => {
    const csvData = revenueDataByYear[selectedYear];
    const csvString = [
      ["Month", "Tickets", "Popcorn", "Beverages"],
      ...csvData.map((row) => [
        row.month,
        row.tickets,
        row.popcorn,
        row.beverages,
      ]),
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

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Daily Report</h1>
        <div className="flex items-center space-x-4">
          <DatePicker
            selected={selectedDate}
            onChange={(date) => setSelectedDate(date)}
            className="p-2 border rounded-md"
          />
          <button
            onClick={handleExport}
            className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
          >
            <FaFileExport />
            <span>Export CSV</span>
          </button>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-blue-50 p-6 rounded-lg">
          <div className="flex items-center space-x-4">
            <FaFilm className="text-4xl text-blue-600" />
            <div>
              <h3 className="text-lg font-semibold text-gray-800">
                Tổng vé đã bán
              </h3>
              <p className="text-3xl font-bold text-blue-600">
                {statistics.employees}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-blue-50 p-6 rounded-lg">
          <div className="flex items-center space-x-4">
            <FaShopify className="text-4xl text-yellow-600" />
            <div>
              <h3 className="text-lg font-semibold text-gray-800">
                Tổng doanh thu ngày
              </h3>
              <p className="text-3xl font-bold text-yellow-600">
                {statistics.employees}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-green-50 p-6 rounded-lg">
          <div className="flex items-center space-x-4">
            <FaCreditCard className="text-4xl text-green-600" />
            <div>
              <h3 className="text-lg font-semibold text-gray-800">
                Doanh thu từ vé
              </h3>
              <p className="text-3xl font-bold text-green-600">
                {statistics.movies}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-purple-50 p-6 rounded-lg">
          <div className="flex items-center space-x-4">
            <FaUtensils className="text-4xl text-purple-600" />
            <div>
              <h3 className="text-lg font-semibold text-gray-800">
                Sản phẩm khác
              </h3>
              <p className="text-3xl font-bold text-purple-600">
                {statistics.screenings}
              </p>
            </div>
          </div>
        </div>
      </div>
      <PieCharts
        movieData={ticketMovieData}
        ticketStatusData={itemData}
        ticketTypeData={ticketTypeData}
      />
    </div>
  );
};

export default DailyReport;

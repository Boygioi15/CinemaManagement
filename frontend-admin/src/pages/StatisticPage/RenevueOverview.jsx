import React, { useState, useEffect } from "react";
import { FaFileExport } from "react-icons/fa";
import "react-datepicker/dist/react-datepicker.css";
import ColumnChart from "../../components/Statistic/ColumnChart";
import axios from "axios";

const AnnualRevenuePage = () => {
  const [revenueDataByYear, setRevenueDataByYear] = useState({});
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  useEffect(() => {
    fetchData(selectedYear); // Fetch dữ liệu cho năm mặc định khi render lần đầu
  }, [selectedYear]);

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

  const transformApiDataToRevenueData = (apiData, year) => {
    return apiData.map((item) => {
      const {
        month,
        totalTicketRevenue,
        totalPopcornRevenue,
        totalDrinksRevenue,
      } = item;
      const monthName = new Date(0, month - 1).toLocaleString("en-US", {
        month: "2-digit",
      });

      return {
        month: monthName,
        vé: totalTicketRevenue,
        sảnphẩmkhác: totalPopcornRevenue + totalDrinksRevenue,
      };
    });
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
    <div className="min-h-auto bg-gray-100 ">
      <div className="flex justify-end">
        {/* <button
          onClick={handleExport}
          className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
        >
          <FaFileExport />
          <span>Export CSV</span>
        </button> */}
      </div>
      <ColumnChart
        revenueDataByYear={revenueDataByYear}
        selectedYear={selectedYear}
        setSelectedYear={setSelectedYear}
      />
    </div>
  );
};

export default AnnualRevenuePage;

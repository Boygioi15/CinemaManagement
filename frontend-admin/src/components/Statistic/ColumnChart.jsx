import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import axios from "axios";
import { useEffect, useState } from "react";

const ColumnChart = ({ revenueDataByYear, selectedYear, setSelectedYear }) => {
  const [availableYears, setAvailableYears] = useState([]);

  useEffect(() => {
    const fetchYears = async () => {
      try {
        const response = await axios.get("http://localhost:8000/api/orders");
        const years = extractYears(response.data);
        console.log(years);

        setAvailableYears(years);
      } catch (error) {
        console.error("Failed to fetch years:", error);
      }
    };

    fetchYears();
  }, []);

  const extractYears = (orders) => {
    const years = orders.map((order) => {
      const date = new Date(order.createdAt);
      return date.getFullYear(); // Lấy năm từ trường `createAt`
    });

    // Loại bỏ các giá trị trùng lặp và sắp xếp theo thứ tự giảm dần
    return [...new Set(years)].sort((a, b) => b - a);
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-2 shadow rounded-md border">
          <p className="font-semibold text-gray-700">{`Tháng ${label}`}</p>
          {payload.map((entry, index) => (
            <p key={`item-${index}`} className="text-gray-600">
              {`${entry.name}: ${entry.value.toLocaleString()} VNĐ`}
            </p>
          ))}
        </div>
      );
    }

    return null;
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-2xl font-semibold">Revenue Overview</h3>
        <select
          value={selectedYear}
          onChange={(e) => setSelectedYear(e.target.value)}
          className="p-2 border rounded-md"
        >
          {availableYears.map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>
      </div>
      <ResponsiveContainer width="100%" height={400}>
        <BarChart data={revenueDataByYear[selectedYear]}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          <Bar dataKey="vé" fill="#8884d8" />
          <Bar dataKey="sảnphẩmkhác" fill="#82ca9d" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ColumnChart;

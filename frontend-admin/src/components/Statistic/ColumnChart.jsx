import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import axios from "axios";
import { useEffect, useState } from "react";

const LineChartComponent = ({
  revenueDataByYear,
  selectedYear,
  setSelectedYear,
}) => {
  const [availableYears, setAvailableYears] = useState([]);
  const [hasData, setHasData] = useState(true);

  console.log(revenueDataByYear);

  useEffect(() => {
    const fetchYears = async () => {
      try {
        const response = await axios.get("http://localhost:8000/api/orders");

        const years = extractYears(response.data.data);

        setAvailableYears(
          years.length > 0 ? years : [new Date().getFullYear()]
        );
      } catch (error) {
        console.error("Failed to fetch years:", error);
        setAvailableYears([new Date().getFullYear()]);
      }
    };

    fetchYears();
  }, []);

  useEffect(() => {
    if (
      !revenueDataByYear[selectedYear] ||
      revenueDataByYear[selectedYear].length === 0
    ) {
      setHasData(false);
    } else {
      setHasData(true);
    }
  }, [selectedYear, revenueDataByYear]);

  const extractYears = (orders) => {
    const years = orders.map((order) => {
      const date = new Date(order.createdAt);
      return date.getFullYear();
    });

    // Loại bỏ trùng lặp và sắp xếp giảm dần
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
        <h3 className="text-2xl font-semibold">Doanh thu năm</h3>
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
      {hasData ? (
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={revenueDataByYear[selectedYear]}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="month"
              tickFormatter={(value) => `Tháng ${value}`}
            />
            <YAxis
              tickFormatter={(value) => `${(value / 1_000_000).toFixed(1)}M`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Line
              type="monotone"
              dataKey="thuần"
              stroke="#8884d8"
              name="Doanh thu (thuần)"
            />
            <Line
              type="monotone"
              dataKey="thựctế"
              stroke="#82ca9d"
              name="Doanh thu (thực tế)"
            />
          </LineChart>
        </ResponsiveContainer>
      ) : (
        <div className="text-xl text-center text-gray-700">
          Không có dữ liệu
        </div>
      )}
    </div>
  );
};

export default LineChartComponent;

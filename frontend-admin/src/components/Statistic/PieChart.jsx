import React from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

const PieCharts = ({ movieData, ticketStatusData, ticketTypeData }) => {
  const CustomPieTooltip = ({ payload }) => {
    if (payload && payload.length) {
      const { name, value } = payload[0].payload;
      return (
        <div className="custom-tooltip bg-white p-2 rounded shadow">
          <p className="label">{`${name}: ${value}`}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 overflow-visible">
      <div className="bg-white p-4 rounded-lg shadow overflow-visible">
        <h3 className="text-lg font-semibold mb-4">Tỉ lệ vé theo phim</h3>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={movieData}
              cx="50%"
              cy="50%"
              labelLine={false}
              // label={({ name, percent }) =>
              //   `${name} ${(percent * 100).toFixed(0)}%`
              // }
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {movieData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip content={<CustomPieTooltip />} />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="bg-white p-4 rounded-lg shadow overflow-visible">
        <h3 className="text-lg font-semibold mb-4">Tỉ lệ sản phẩm khác</h3>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={ticketStatusData}
              cx="50%"
              cy="50%"
              labelLine={false}
              // label={({ name, percent }) =>
              //   `${name} ${(percent * 100).toFixed(0)}%`
              // }
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {ticketStatusData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip content={<CustomPieTooltip />} />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="bg-white p-4 rounded-lg shadow overflow-visible">
        <h3 className="text-lg font-semibold mb-4">Tỉ lệ vé theo loại</h3>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={ticketTypeData}
              cx="50%"
              cy="50%"
              labelLine={false}
              // label={({ name, percent }) =>
              //   `${name} ${(percent * 100).toFixed(0)}%`
              // }
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {ticketTypeData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip content={<CustomPieTooltip />} />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default PieCharts;

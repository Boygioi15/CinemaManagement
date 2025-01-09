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

  const renderPieChart = (data, title) => (
    <div className="bg-white p-4 rounded-lg shadow overflow-visible">
      <h3 className="text-lg font-semibold mb-4">{title}</h3>
      {data && data.length > 0 ? (
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip content={<CustomPieTooltip />} />
          </PieChart>
        </ResponsiveContainer>
      ) : (
        <div className="text-center text-gray-500">Không có dữ liệu</div>
      )}
    </div>
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 overflow-visible">
      {renderPieChart(movieData, "Tỉ lệ vé theo phim (thuần)")}
      {renderPieChart(ticketStatusData, "Tỉ lệ sản phẩm khác (thuần)")}
      {renderPieChart(ticketTypeData, "Tỉ lệ vé theo loại (thuần)")}
    </div>
  );
};

export default PieCharts;

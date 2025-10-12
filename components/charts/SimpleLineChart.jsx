// components/charts/SimpleLineChart.jsx

import { LineChart, Line, ResponsiveContainer, Tooltip } from "recharts";

const SimpleLineChart = ({ data, labels, title, color = "#3b82f6" }) => {
  const chartData = data.map((value, index) => ({
    name: labels[index],
    value: value,
  }));

  return (
    <div>
      <p className="text-sm font-semibold text-gray-700 mb-2">{title}</p>
      <ResponsiveContainer width="100%" height={80}>
        <LineChart data={chartData}>
          <Line
            type="monotone"
            dataKey="value"
            stroke={color}
            strokeWidth={2}
            dot={false}
          />
          <Tooltip />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

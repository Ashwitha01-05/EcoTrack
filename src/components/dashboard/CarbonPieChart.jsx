import React from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";
import { CATEGORY_CONFIG } from "../shared/EmissionFactors";

export default function CarbonPieChart({ activities }) {
  const data = Object.entries(CATEGORY_CONFIG).map(([key, config]) => {
    const total = activities
      .filter((a) => a.category === key)
      .reduce((sum, a) => sum + (a.carbon_kg || 0), 0);
    return { name: config.label, value: Math.round(total * 100) / 100, color: config.color };
  }).filter(d => d.value > 0);

  if (data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-gray-400">
        <p className="text-sm">No data yet — start logging activities!</p>
      </div>
    );
  }

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 px-4 py-3">
          <p className="text-sm font-semibold text-gray-800">{payload[0].name}</p>
          <p className="text-sm text-gray-500">{payload[0].value.toFixed(1)} kg CO₂</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="h-72">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={100}
            paddingAngle={4}
            dataKey="value"
            strokeWidth={0}
          >
            {data.map((entry, index) => (
              <Cell key={index} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend
            verticalAlign="bottom"
            iconType="circle"
            formatter={(value) => <span className="text-sm text-gray-600 ml-1">{value}</span>}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
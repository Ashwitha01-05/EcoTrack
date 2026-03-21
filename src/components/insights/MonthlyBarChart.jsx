import React from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { format, subMonths, startOfMonth, endOfMonth, isWithinInterval } from "date-fns";
import { CATEGORY_CONFIG } from "../shared/EmissionFactors";

export default function MonthlyBarChart({ activities }) {
  const months = Array.from({ length: 6 }, (_, i) => {
    const date = subMonths(new Date(), 5 - i);
    const start = startOfMonth(date);
    const end = endOfMonth(date);
    const monthStr = format(date, "MMM");

    const monthData = { month: monthStr };
    Object.keys(CATEGORY_CONFIG).forEach((cat) => {
      monthData[cat] = activities
        .filter((a) => {
          if (!a.date) return false;
          const aDate = new Date(a.date);
          return a.category === cat && isWithinInterval(aDate, { start, end });
        })
        .reduce((sum, a) => sum + (a.carbon_kg || 0), 0);
      monthData[cat] = Math.round(monthData[cat] * 100) / 100;
    });
    return monthData;
  });

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const total = payload.reduce((sum, p) => sum + p.value, 0);
      return (
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 px-4 py-3">
          <p className="text-sm font-semibold text-gray-800 mb-2">{label}</p>
          {payload.map((p, i) => (
            <div key={i} className="flex items-center gap-2 text-sm">
              <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: p.color }} />
              <span className="text-gray-500">{CATEGORY_CONFIG[p.dataKey]?.label}:</span>
              <span className="font-medium">{p.value.toFixed(1)} kg</span>
            </div>
          ))}
          <div className="border-t mt-2 pt-2 text-sm font-semibold text-gray-700">
            Total: {total.toFixed(1)} kg CO₂
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="h-80">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={months} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis dataKey="month" tick={{ fontSize: 12, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fontSize: 12, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
          <Tooltip content={<CustomTooltip />} />
          <Legend
            verticalAlign="top"
            iconType="circle"
            formatter={(value) => (
              <span className="text-sm text-gray-600 ml-1">{CATEGORY_CONFIG[value]?.label}</span>
            )}
          />
          <Bar dataKey="travel" stackId="a" fill={CATEGORY_CONFIG.travel.color} radius={[0, 0, 0, 0]} />
          <Bar dataKey="food" stackId="a" fill={CATEGORY_CONFIG.food.color} radius={[0, 0, 0, 0]} />
          <Bar dataKey="electricity" stackId="a" fill={CATEGORY_CONFIG.electricity.color} radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
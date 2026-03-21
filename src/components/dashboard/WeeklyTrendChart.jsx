import React from "react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { format, subDays, startOfDay } from "date-fns";

export default function WeeklyTrendChart({ activities }) {
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = subDays(new Date(), 6 - i);
    const dateStr = format(date, "yyyy-MM-dd");
    const dayActivities = activities.filter((a) => a.date === dateStr);
    const total = dayActivities.reduce((sum, a) => sum + (a.carbon_kg || 0), 0);
    return {
      day: format(date, "EEE"),
      date: format(date, "MMM d"),
      carbon: Math.round(total * 100) / 100,
    };
  });

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 px-4 py-3">
          <p className="text-xs text-gray-400 mb-1">{payload[0]?.payload?.date}</p>
          <p className="text-sm font-semibold text-emerald-700">
            {payload[0].value.toFixed(1)} kg CO₂
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="h-72">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={last7Days} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
          <defs>
            <linearGradient id="carbonGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#0D9488" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#0D9488" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis
            dataKey="day"
            tick={{ fontSize: 12, fill: "#9ca3af" }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tick={{ fontSize: 12, fill: "#9ca3af" }}
            axisLine={false}
            tickLine={false}
            tickFormatter={(v) => `${v}`}
          />
          <Tooltip content={<CustomTooltip />} />
          <Area
            type="monotone"
            dataKey="carbon"
            stroke="#0D9488"
            strokeWidth={2.5}
            fill="url(#carbonGradient)"
            dot={{ fill: "#0D9488", strokeWidth: 0, r: 4 }}
            activeDot={{ r: 6, fill: "#0D9488", strokeWidth: 2, stroke: "#fff" }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
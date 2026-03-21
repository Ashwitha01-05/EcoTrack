import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { BarChart3, TrendingDown } from "lucide-react";
import CarbonPieChart from "../components/dashboard/CarbonPieChart";
import MonthlyBarChart from "../components/insights/MonthlyBarChart";
import CarbonSummaryCards from "../components/dashboard/CarbonSummaryCards";
import { subDays, subMonths, startOfMonth, endOfMonth, isWithinInterval } from "date-fns";

const PERIODS = [
  { key: "week", label: "This Week", days: 7 },
  { key: "month", label: "This Month", days: 30 },
  { key: "3months", label: "3 Months", days: 90 },
];

export default function Insights() {
  const [period, setPeriod] = useState("month");

  const { data: activities = [], isLoading } = useQuery({
    queryKey: ["activities"],
    queryFn: () => base44.entities.Activity.list("-date", 500),
  });

  const periodConfig = PERIODS.find((p) => p.key === period);
  const filteredActivities = activities.filter((a) => {
    if (!a.date) return false;
    return new Date(a.date) >= subDays(new Date(), periodConfig.days);
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-10 h-10 border-3 border-emerald-200 border-t-emerald-600 rounded-full animate-spin" />
      </div>
    );
  }

  const totalCarbon = filteredActivities.reduce((sum, a) => sum + (a.carbon_kg || 0), 0);
  const avgDaily = periodConfig.days > 0 ? totalCarbon / periodConfig.days : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Insights</h1>
          <p className="text-sm text-gray-500 mt-1">Understand your carbon footprint patterns</p>
        </div>
        <div className="flex bg-gray-100 rounded-xl p-1">
          {PERIODS.map((p) => (
            <button
              key={p.key}
              onClick={() => setPeriod(p.key)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                period === p.key ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* Summary */}
      <CarbonSummaryCards activities={filteredActivities} periodLabel={periodConfig.label} />

      {/* Average Card */}
      <div className="bg-gradient-to-r from-teal-50 to-emerald-50 rounded-2xl border border-teal-200 p-5 flex items-center gap-4">
        <div className="p-3 bg-teal-100 rounded-xl">
          <TrendingDown className="w-5 h-5 text-teal-700" />
        </div>
        <div>
          <p className="text-sm text-teal-600 font-medium">Daily Average</p>
          <p className="text-xl font-bold text-teal-800">{avgDaily.toFixed(2)} kg CO₂ / day</p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Category Breakdown</h2>
          <CarbonPieChart activities={filteredActivities} />
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Monthly Overview</h2>
          <MonthlyBarChart activities={activities} />
        </div>
      </div>
    </div>
  );
}
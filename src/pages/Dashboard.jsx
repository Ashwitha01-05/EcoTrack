import React from "react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { Plus, BarChart3, Target } from "lucide-react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import CarbonSummaryCards from "../components/dashboard/CarbonSummaryCards";
import CarbonPieChart from "../components/dashboard/CarbonPieChart";
import WeeklyTrendChart from "../components/dashboard/WeeklyTrendChart";
import EcoTipCard from "../components/dashboard/EcoTipCard";
import RecentActivityList from "../components/dashboard/RecentActivityList";
import { format, subDays } from "date-fns";

export default function Dashboard() {
  const { data: activities = [], isLoading } = useQuery({
    queryKey: ["activities"],
    queryFn: () => base44.entities.Activity.list("-date", 200),
  });

  const thisWeek = activities.filter((a) => {
    if (!a.date) return false;
    const d = new Date(a.date);
    return d >= subDays(new Date(), 7);
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-3 border-emerald-200 border-t-emerald-600 rounded-full animate-spin" />
          <p className="text-sm text-gray-400">Loading your eco data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-sm text-gray-500 mt-1">Your sustainability at a glance</p>
        </div>
        <Link
          to={createPageUrl("LogActivity")}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-sm shadow-lg shadow-emerald-200 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Log Activity
        </Link>
      </div>

      {/* Summary Cards */}
      <CarbonSummaryCards activities={thisWeek} periodLabel="This week" />

      {/* Eco Tip */}
      <EcoTipCard />

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Weekly Trend</h2>
          <WeeklyTrendChart activities={activities} />
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Emissions Breakdown</h2>
          <CarbonPieChart activities={thisWeek} />
        </div>
      </div>

      {/* Recent Activities */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-800">Recent Activities</h2>
          <Link
            to={createPageUrl("History")}
            className="text-sm text-emerald-600 hover:text-emerald-700 font-medium"
          >
            View all →
          </Link>
        </div>
        <RecentActivityList activities={activities} />
      </div>
    </div>
  );
}
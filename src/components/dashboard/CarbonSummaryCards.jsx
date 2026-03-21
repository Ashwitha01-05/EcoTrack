import React from "react";
import { Leaf, Car, Utensils, Zap, TrendingDown, TrendingUp } from "lucide-react";
import { CATEGORY_CONFIG } from "../shared/EmissionFactors";

const iconMap = {
  travel: Car,
  food: Utensils,
  electricity: Zap,
};

export default function CarbonSummaryCards({ activities, periodLabel }) {
  const totalCarbon = activities.reduce((sum, a) => sum + (a.carbon_kg || 0), 0);

  const byCategory = Object.keys(CATEGORY_CONFIG).map((cat) => {
    const catActivities = activities.filter((a) => a.category === cat);
    const total = catActivities.reduce((sum, a) => sum + (a.carbon_kg || 0), 0);
    return { category: cat, total, count: catActivities.length };
  });

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Total Card */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-600 to-teal-700 p-5 text-white shadow-lg">
        <div className="absolute -top-4 -right-4 w-24 h-24 bg-white/10 rounded-full" />
        <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-white/5 rounded-full" />
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-3">
            <div className="p-2 bg-white/20 rounded-lg">
              <Leaf className="w-4 h-4" />
            </div>
            <span className="text-emerald-100 text-sm font-medium">Total CO₂</span>
          </div>
          <p className="text-3xl font-bold tracking-tight">
            {totalCarbon.toFixed(1)}
            <span className="text-lg font-normal ml-1 text-emerald-200">kg</span>
          </p>
          <p className="text-emerald-200 text-xs mt-2">{periodLabel}</p>
        </div>
      </div>

      {/* Category Cards */}
      {byCategory.map(({ category, total, count }) => {
        const config = CATEGORY_CONFIG[category];
        const Icon = iconMap[category];
        return (
          <div
            key={category}
            className={`relative overflow-hidden rounded-2xl ${config.bgColor} border ${config.borderColor} p-5 shadow-sm hover:shadow-md transition-shadow`}
          >
            <div className="flex items-center gap-2 mb-3">
              <div className={`p-2 rounded-lg ${config.textColor} bg-white/60`}>
                <Icon className="w-4 h-4" />
              </div>
              <span className={`text-sm font-medium ${config.textColor}`}>{config.label}</span>
            </div>
            <p className={`text-2xl font-bold tracking-tight ${config.textColor}`}>
              {total.toFixed(1)}
              <span className="text-sm font-normal ml-1 opacity-70">kg CO₂</span>
            </p>
            <p className="text-xs mt-2 opacity-60">{count} {count === 1 ? "activity" : "activities"}</p>
          </div>
        );
      })}
    </div>
  );
}
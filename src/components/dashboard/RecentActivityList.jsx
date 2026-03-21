import React from "react";
import { format } from "date-fns";
import { Car, Utensils, Zap, ArrowRight } from "lucide-react";
import { CATEGORY_CONFIG, EMISSION_FACTORS } from "../shared/EmissionFactors";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";

const categoryIcons = { travel: Car, food: Utensils, electricity: Zap };

export default function RecentActivityList({ activities }) {
  const recent = [...activities]
    .sort((a, b) => new Date(b.created_date) - new Date(a.created_date))
    .slice(0, 5);

  if (recent.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-gray-400">
        <p className="text-sm">No recent activities</p>
        <Link
          to={createPageUrl("LogActivity")}
          className="mt-2 text-emerald-600 text-sm font-medium hover:underline flex items-center gap-1"
        >
          Log your first activity <ArrowRight className="w-3 h-3" />
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {recent.map((activity) => {
        const config = CATEGORY_CONFIG[activity.category];
        const Icon = categoryIcons[activity.category];
        const activityInfo = EMISSION_FACTORS[activity.category]?.[activity.activity_type];
        return (
          <div
            key={activity.id}
            className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors"
          >
            <div className={`p-2 rounded-lg ${config.bgColor}`}>
              <Icon className={`w-4 h-4 ${config.textColor}`} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-800 truncate">
                {activityInfo?.label || activity.activity_type}
              </p>
              <p className="text-xs text-gray-400">
                {activity.value} {activityInfo?.unit || ""} · {activity.date ? format(new Date(activity.date), "MMM d") : ""}
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm font-semibold text-gray-700">{activity.carbon_kg?.toFixed(1)}</p>
              <p className="text-xs text-gray-400">kg CO₂</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
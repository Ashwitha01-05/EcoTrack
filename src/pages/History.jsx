import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import { Car, Utensils, Zap, Trash2, Search, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { CATEGORY_CONFIG, EMISSION_FACTORS } from "../components/shared/EmissionFactors";

const categoryIcons = { travel: Car, food: Utensils, electricity: Zap };

export default function History() {
  const [filterCategory, setFilterCategory] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const queryClient = useQueryClient();

  const { data: activities = [], isLoading } = useQuery({
    queryKey: ["activities"],
    queryFn: () => base44.entities.Activity.list("-date", 500),
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => base44.entities.Activity.delete(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["activities"] }),
  });

  const filtered = activities.filter((a) => {
    const matchesCategory = filterCategory === "all" || a.category === filterCategory;
    const activityInfo = EMISSION_FACTORS[a.category]?.[a.activity_type];
    const matchesSearch =
      !searchTerm ||
      (activityInfo?.label || a.activity_type).toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Group by date
  const grouped = filtered.reduce((acc, activity) => {
    const date = activity.date || "Unknown";
    if (!acc[date]) acc[date] = [];
    acc[date].push(activity);
    return acc;
  }, {});

  const sortedDates = Object.keys(grouped).sort((a, b) => new Date(b) - new Date(a));

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-10 h-10 border-3 border-emerald-200 border-t-emerald-600 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Activity History</h1>
        <p className="text-sm text-gray-500 mt-1">{activities.length} activities logged</p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <Input
            placeholder="Search activities..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 rounded-xl h-11"
          />
        </div>
        <Select value={filterCategory} onValueChange={setFilterCategory}>
          <SelectTrigger className="w-full sm:w-44 rounded-xl h-11">
            <Filter className="w-4 h-4 mr-2 text-gray-400" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            <SelectItem value="travel">Travel</SelectItem>
            <SelectItem value="food">Food</SelectItem>
            <SelectItem value="electricity">Electricity</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Activity Groups */}
      {sortedDates.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
          <p className="text-gray-400 text-sm">No activities found</p>
        </div>
      ) : (
        sortedDates.map((date) => (
          <div key={date}>
            <div className="flex items-center gap-3 mb-3">
              <p className="text-sm font-semibold text-gray-700">
                {date !== "Unknown" ? format(new Date(date), "EEEE, MMM d, yyyy") : "Unknown Date"}
              </p>
              <div className="flex-1 h-px bg-gray-100" />
              <p className="text-xs text-gray-400">
                {grouped[date].reduce((s, a) => s + (a.carbon_kg || 0), 0).toFixed(1)} kg CO₂
              </p>
            </div>
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden divide-y divide-gray-50">
              {grouped[date].map((activity) => {
                const config = CATEGORY_CONFIG[activity.category];
                const Icon = categoryIcons[activity.category];
                const activityInfo = EMISSION_FACTORS[activity.category]?.[activity.activity_type];
                return (
                  <div key={activity.id} className="flex items-center gap-3 p-4 hover:bg-gray-50/50 transition-colors">
                    <div className={`p-2 rounded-lg ${config.bgColor}`}>
                      <Icon className={`w-4 h-4 ${config.textColor}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-800 truncate">
                        {activityInfo?.label || activity.activity_type}
                      </p>
                      <p className="text-xs text-gray-400">
                        {activity.value} {activityInfo?.unit || ""}
                        {activity.notes && ` · ${activity.notes}`}
                      </p>
                    </div>
                    <div className="text-right mr-2">
                      <p className="text-sm font-semibold text-gray-700">{activity.carbon_kg?.toFixed(2)}</p>
                      <p className="text-xs text-gray-400">kg CO₂</p>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-gray-300 hover:text-red-500"
                      onClick={() => deleteMutation.mutate(activity.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                );
              })}
            </div>
          </div>
        ))
      )}
    </div>
  );
}
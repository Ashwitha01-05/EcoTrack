import React from "react";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Clock, SkipForward, Trophy, Leaf, Car, Utensils, Zap } from "lucide-react";
import { CATEGORY_CONFIG } from "../shared/EmissionFactors";

const categoryIcons = { travel: Car, food: Utensils, electricity: Zap, general: Leaf };

export default function ChallengeCard({ challenge, onUpdate }) {
  const config = CATEGORY_CONFIG[challenge.category] || {
    label: "General",
    bgColor: "bg-emerald-50",
    textColor: "text-emerald-700",
    borderColor: "border-emerald-200",
  };
  const Icon = categoryIcons[challenge.category] || Leaf;
  const progress = challenge.target_days
    ? Math.min((challenge.progress_days || 0) / challenge.target_days, 1) * 100
    : 0;
  const isCompleted = challenge.status === "completed";

  return (
    <div
      className={`rounded-2xl border p-5 transition-all ${
        isCompleted
          ? "bg-emerald-50/50 border-emerald-200 opacity-80"
          : `bg-white ${config.borderColor} hover:shadow-md`
      }`}
    >
      <div className="flex items-start gap-3">
        <div className={`p-2 rounded-xl ${isCompleted ? "bg-emerald-100" : config.bgColor}`}>
          {isCompleted ? (
            <Trophy className="w-5 h-5 text-emerald-600" />
          ) : (
            <Icon className={`w-5 h-5 ${config.textColor}`} />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className={`font-semibold text-sm ${isCompleted ? "line-through text-gray-400" : "text-gray-800"}`}>
            {challenge.title}
          </h3>
          {challenge.description && (
            <p className="text-xs text-gray-500 mt-1 leading-relaxed">{challenge.description}</p>
          )}

          {/* Progress Bar */}
          {challenge.target_days && !isCompleted && (
            <div className="mt-3">
              <div className="flex justify-between text-xs text-gray-400 mb-1">
                <span>{challenge.progress_days || 0} / {challenge.target_days} days</span>
                <span>{Math.round(progress)}%</span>
              </div>
              <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          )}

          {/* Actions */}
          {!isCompleted && (
            <div className="flex gap-2 mt-3">
              <Button
                size="sm"
                variant="outline"
                className="h-8 text-xs rounded-lg"
                onClick={() =>
                  onUpdate(challenge.id, {
                    progress_days: (challenge.progress_days || 0) + 1,
                    status:
                      challenge.target_days && (challenge.progress_days || 0) + 1 >= challenge.target_days
                        ? "completed"
                        : "active",
                  })
                }
              >
                <CheckCircle2 className="w-3 h-3 mr-1" />
                +1 Day
              </Button>
              <Button
                size="sm"
                variant="ghost"
                className="h-8 text-xs rounded-lg text-gray-400"
                onClick={() => onUpdate(challenge.id, { status: "completed" })}
              >
                <SkipForward className="w-3 h-3 mr-1" />
                Complete
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
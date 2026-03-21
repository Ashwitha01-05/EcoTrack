import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Car, Utensils, Zap, Leaf, Plus, Loader2 } from "lucide-react";
import { EMISSION_FACTORS, CATEGORY_CONFIG, calculateCarbon } from "../shared/EmissionFactors";
import { format } from "date-fns";

const categoryIcons = { travel: Car, food: Utensils, electricity: Zap };

export default function ActivityForm({ onSubmit, isSubmitting }) {
  const [category, setCategory] = useState("");
  const [activityType, setActivityType] = useState("");
  const [value, setValue] = useState("");
  const [date, setDate] = useState(format(new Date(), "yyyy-MM-dd"));
  const [notes, setNotes] = useState("");

  const availableTypes = category ? Object.entries(EMISSION_FACTORS[category] || {}) : [];
  const selectedTypeInfo = category && activityType ? EMISSION_FACTORS[category]?.[activityType] : null;
  const carbonPreview = selectedTypeInfo && value ? calculateCarbon(category, activityType, parseFloat(value)) : 0;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      category,
      activity_type: activityType,
      value: parseFloat(value),
      unit: selectedTypeInfo?.unit || "",
      carbon_kg: carbonPreview,
      date,
      notes: notes || undefined,
    });
    setCategory("");
    setActivityType("");
    setValue("");
    setNotes("");
  };

  const handleCategoryChange = (val) => {
    setCategory(val);
    setActivityType("");
    setValue("");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Category Selection */}
      <div>
        <Label className="text-sm font-medium text-gray-700 mb-3 block">Category</Label>
        <div className="grid grid-cols-3 gap-3">
          {Object.entries(CATEGORY_CONFIG).map(([key, config]) => {
            const Icon = categoryIcons[key];
            const isActive = category === key;
            return (
              <button
                key={key}
                type="button"
                onClick={() => handleCategoryChange(key)}
                className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${
                  isActive
                    ? `${config.borderColor} ${config.bgColor} shadow-sm`
                    : "border-gray-100 hover:border-gray-200 bg-white"
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? config.textColor : "text-gray-400"}`} />
                <span className={`text-sm font-medium ${isActive ? config.textColor : "text-gray-500"}`}>
                  {config.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Activity Type */}
      {category && (
        <div className="animate-in fade-in slide-in-from-top-2 duration-200">
          <Label className="text-sm font-medium text-gray-700 mb-2 block">Activity Type</Label>
          <Select value={activityType} onValueChange={setActivityType}>
            <SelectTrigger className="rounded-xl h-11">
              <SelectValue placeholder="Select activity..." />
            </SelectTrigger>
            <SelectContent>
              {availableTypes.map(([key, info]) => (
                <SelectItem key={key} value={key}>
                  {info.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      {/* Value Input */}
      {activityType && (
        <div className="animate-in fade-in slide-in-from-top-2 duration-200">
          <Label className="text-sm font-medium text-gray-700 mb-2 block">
            Amount ({selectedTypeInfo?.unit})
          </Label>
          <Input
            type="number"
            step="0.1"
            min="0"
            placeholder={`Enter ${selectedTypeInfo?.unit}...`}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            className="rounded-xl h-11"
          />
        </div>
      )}

      {/* Carbon Preview */}
      {carbonPreview > 0 && (
        <div className="animate-in fade-in duration-200 flex items-center gap-3 p-4 rounded-xl bg-emerald-50 border border-emerald-200">
          <Leaf className="w-5 h-5 text-emerald-600" />
          <div>
            <p className="text-sm text-emerald-600 font-medium">Estimated Carbon Footprint</p>
            <p className="text-2xl font-bold text-emerald-800">{carbonPreview.toFixed(2)} kg CO₂</p>
          </div>
        </div>
      )}

      {/* Date */}
      <div>
        <Label className="text-sm font-medium text-gray-700 mb-2 block">Date</Label>
        <Input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="rounded-xl h-11"
        />
      </div>

      {/* Notes */}
      <div>
        <Label className="text-sm font-medium text-gray-700 mb-2 block">Notes (optional)</Label>
        <Textarea
          placeholder="Any details about this activity..."
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          className="rounded-xl resize-none"
          rows={2}
        />
      </div>

      {/* Submit */}
      <Button
        type="submit"
        disabled={!category || !activityType || !value || isSubmitting}
        className="w-full h-12 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-base shadow-lg shadow-emerald-200"
      >
        {isSubmitting ? (
          <Loader2 className="w-5 h-5 animate-spin" />
        ) : (
          <>
            <Plus className="w-5 h-5 mr-2" />
            Log Activity
          </>
        )}
      </Button>
    </form>
  );
}
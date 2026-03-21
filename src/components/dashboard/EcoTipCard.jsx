import React, { useState, useEffect } from "react";
import { Lightbulb, RefreshCw } from "lucide-react";
import { ECO_TIPS } from "../shared/EmissionFactors";

export default function EcoTipCard() {
  const [tipIndex, setTipIndex] = useState(0);
  const tip = ECO_TIPS[tipIndex];

  const nextTip = () => {
    setTipIndex((prev) => (prev + 1) % ECO_TIPS.length);
  };

  useEffect(() => {
    setTipIndex(Math.floor(Math.random() * ECO_TIPS.length));
  }, []);

  return (
    <div className="rounded-2xl bg-gradient-to-r from-amber-50 to-yellow-50 border border-amber-200 p-5">
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-3">
          <div className="p-2 bg-amber-100 rounded-lg mt-0.5">
            <Lightbulb className="w-4 h-4 text-amber-600" />
          </div>
          <div>
            <p className="text-xs font-semibold text-amber-600 uppercase tracking-wide mb-1">Eco Tip</p>
            <p className="text-sm text-amber-900 leading-relaxed">{tip.tip}</p>
          </div>
        </div>
        <button
          onClick={nextTip}
          className="p-1.5 hover:bg-amber-100 rounded-lg transition-colors text-amber-500"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
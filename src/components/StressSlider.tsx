import { Sparkles } from "lucide-react";

interface StressSliderProps {
  value: number;
  onChange: (value: number) => void;
}

export default function StressSlider({ value, onChange }: StressSliderProps) {
  // Determine helpful helper label based on value
  const getStressLabel = (val: number) => {
    if (val <= 2) return { text: "Chill / Peaceful 🟢", color: "text-emerald-600 bg-emerald-50 border-emerald-200" };
    if (val <= 4) return { text: "Manageable / Mild 🟡", color: "text-blue-600 bg-blue-50 border-blue-200" };
    if (val <= 6) return { text: "Alert / Moderate 🟠", color: "text-amber-600 bg-amber-50 border-amber-200" };
    if (val <= 8) return { text: "Heavy / Stressed 🔴", color: "text-rose-600 bg-rose-50 border-rose-200" };
    return { text: "Extreme / Crisis 🚨", color: "text-red-700 bg-red-100 border-red-300 animate-pulse" };
  };

  const currentLabelByStress = getStressLabel(value);

  return (
    <div className="space-y-4" id="stress-slider-container">
      <div className="flex items-center justify-between" id="stress-slider-header">
        <label htmlFor="stress-range-slider" className="text-lg font-medium text-slate-800 tracking-tight">
          How stressed are you today?
        </label>
        <span className="text-2xl font-bold text-slate-800 tabular-nums">
          {value}<span className="text-sm font-normal text-slate-400">/10</span>
        </span>
      </div>

      <div className="relative pt-1" id="stress-slider-input-wrapper">
        <input
          id="stress-range-slider"
          type="range"
          min="1"
          max="10"
          step="1"
          value={value}
          onChange={(e) => onChange(parseInt(e.target.value, 10))}
          className="w-full h-2 bg-indigo-100 rounded-lg appearance-none cursor-pointer accent-indigo-600 transition-all duration-300 hover:bg-indigo-200"
        />
        <div className="flex justify-between text-[10px] text-slate-400 font-medium px-1 mt-2">
          <span>1 (Relaxed)</span>
          <span>5 (Moderate)</span>
          <span>10 (Overwhelming)</span>
        </div>
      </div>

      <div
        id="stress-indicator-tag"
        className={`flex items-center gap-2 border px-3 py-1.5 rounded-xl text-sm font-medium w-fit transition-all duration-300 ${currentLabelByStress.color}`}
      >
        <Sparkles className="h-4 w-4 shrink-0" />
        <span>{currentLabelByStress.text}</span>
      </div>
    </div>
  );
}

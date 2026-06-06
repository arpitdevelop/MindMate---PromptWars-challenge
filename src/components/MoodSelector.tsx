import { Check } from "lucide-react";

interface MoodSelectorProps {
  selectedMood: string;
  onChange: (mood: string) => void;
}

export const MOODS = [
  { emoji: "😀", label: "Great", color: "from-emerald-400 to-teal-500", text: "text-emerald-500", bg: "bg-emerald-50" },
  { emoji: "🙂", label: "Good", color: "from-sky-400 to-blue-500", text: "text-blue-500", bg: "bg-blue-50" },
  { emoji: "😐", label: "Okay", color: "from-amber-400 to-orange-400", text: "text-amber-500", bg: "bg-amber-50" },
  { emoji: "😔", label: "Stressed", color: "from-purple-400 to-indigo-500", text: "text-purple-500", bg: "bg-purple-50" },
  { emoji: "😭", label: "Overwhelmed", color: "from-rose-400 to-pink-500", text: "text-rose-500", bg: "bg-rose-50" },
];

export default function MoodSelector({ selectedMood, onChange }: MoodSelectorProps) {
  return (
    <div className="space-y-4" id="mood-selector-container">
      <h3 className="text-lg font-medium text-slate-800 tracking-tight" id="mood-selector-title">
        How are you feeling today?
      </h3>
      <div className="grid grid-cols-5 gap-2 sm:gap-4" id="mood-buttons-grid">
        {MOODS.map((item) => {
          const isSelected = selectedMood === `${item.emoji} ${item.label}`;
          return (
            <button
              key={item.label}
              id={`mood-btn-${item.label.toLowerCase()}`}
              type="button"
              onClick={() => onChange(`${item.emoji} ${item.label}`)}
              className={`relative flex flex-col items-center justify-between p-3 rounded-2xl transition-all duration-300 border cursor-pointer group ${
                isSelected
                  ? "border-slate-800 bg-slate-50 shadow-md scale-105"
                  : "border-slate-100 hover:border-slate-300 hover:bg-slate-50 shadow-sm"
              }`}
            >
              <span className="text-3xl sm:text-4xl transition-transform duration-300 group-hover:scale-110 mb-2">
                {item.emoji}
              </span>
              <span className={`text-[10px] sm:text-xs font-semibold tracking-wide text-slate-600`}>
                {item.label}
              </span>
              {isSelected && (
                <div className="absolute -top-1 -right-1 bg-slate-800 text-white rounded-full p-0.5 shadow">
                  <Check className="h-3 w-3" />
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

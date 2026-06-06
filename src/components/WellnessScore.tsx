import { Heart, Activity, ShieldAlert, Sparkles, AlertCircle } from "lucide-react";

interface WellnessScoreProps {
  score: number;
}

export default function WellnessScore({ score }: WellnessScoreProps) {
  // Let's analyze score and render personalized wellness alerts and metrics
  const getDescriptor = (val: number) => {
    if (val >= 85) {
      return {
        title: "Harmonious & Radiant",
        desc: "Fantastic! Your stress handles are beautifully in place. Keep maintaining this exquisite balance.",
        color: "text-emerald-600 border-emerald-100 bg-emerald-50/50",
        barColor: "bg-emerald-500",
        icon: <Sparkles className="h-5 w-5 text-emerald-500" />
      };
    }
    if (val >= 65) {
      return {
        title: "Steady & Upbeat",
        desc: "You're in a highly productive prepared state. Remember to stretch and hydrate regularly to keep going.",
        color: "text-sky-600 border-sky-100 bg-sky-50/50",
        barColor: "bg-sky-500",
        icon: <Sparkles className="h-5 w-5 text-sky-400" />
      };
    }
    if (val >= 45) {
      return {
        title: "Tense but Flowing",
        desc: "A moderate amount of tension detected. Try deep breathing cycles and avoid sitting for over 2 hours.",
        color: "text-amber-600 border-amber-100 bg-amber-50/50",
        barColor: "bg-amber-500",
        icon: <Activity className="h-5 w-5 text-amber-500" />
      };
    }
    if (val >= 25) {
      return {
        title: "Heavily Taxed",
        desc: "Your cognitive reserves are running quite low. It's highly recommended to take a full 30-minute relaxation pause.",
        color: "text-purple-600 border-purple-100 bg-purple-50/50",
        barColor: "bg-purple-500",
        icon: <AlertCircle className="h-5 w-5 text-purple-500" />
      };
    }
    return {
      title: "Extremely Overburdened",
      desc: "Anxiety spikes or exhaustion is highly visible. High stress is blocking active recall. Take a break, drink some water, or message our Coach.",
      color: "text-rose-600 border-rose-100 bg-rose-50/50",
      barColor: "bg-rose-500",
      icon: <ShieldAlert className="h-5 w-5 text-rose-500" />
    };
  };

  const descriptor = getDescriptor(score);

  // Compute a premium letter grade for the visual layout
  const getGrade = (val: number) => {
    if (val >= 90) return "A+";
    if (val >= 75) return "A";
    if (val >= 60) return "B+";
    if (val >= 45) return "C";
    return "F";
  };
  const grade = getGrade(score);

  return (
    <div className="p-6 rounded-[2rem] bg-indigo-600 text-white shadow-xl flex flex-col justify-between overflow-hidden relative" id="wellness-score-container">
      <div className="flex items-start justify-between relative z-10 w-full mb-4" id="wellness-score-header">
        <div className="space-y-1">
          <h3 className="text-xs font-bold opacity-80 uppercase tracking-widest mb-1 flex items-center gap-1.5">
            <Heart className="h-3.5 w-3.5 text-white fill-white/20 animate-pulse" />
            <span>Wellness Score</span>
          </h3>
          <div className="text-4xl font-black tracking-tight">{score} <span className="text-lg font-normal opacity-80">/ 100</span></div>
          <p className="text-xs mt-2 opacity-90 italic">
            "{descriptor.title}"
          </p>
        </div>
        <div className="w-20 h-20 rounded-full border-8 border-white/10 flex items-center justify-center relative shrink-0">
          <div className="w-full h-full rounded-full border-8 border-white border-t-transparent absolute rotate-45"></div>
          <span className="text-lg font-black">{grade}</span>
        </div>
      </div>

      <div className="space-y-2 relative z-10 w-full mb-3" id="wellness-score-progress-bar-container">
        <div className="w-full bg-white/20 h-2 rounded-full overflow-hidden flex" id="score-bar-track">
          <div
            className="h-full bg-white transition-all duration-1000 ease-out"
            style={{ width: `${score}%` }}
          />
        </div>
      </div>

      <div className="p-3.5 rounded-2xl border border-white/20 bg-white/10 backdrop-blur-md flex items-start gap-3 transition-colors duration-300 relative z-10" id="wellness-advice-box">
        <div className="p-1 rounded-lg bg-white/20 border border-white/10 block shrink-0">
          {descriptor.icon}
        </div>
        <div className="space-y-0.5">
          <p className="text-[11px] leading-relaxed text-indigo-100">{descriptor.desc}</p>
        </div>
      </div>

      <div className="absolute -right-4 -bottom-4 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
    </div>
  );
}

import { useState } from "react";
import { Sparkles, Compass, Lightbulb, Coffee, Loader2, AlertCircle } from "lucide-react";
import { DailyMotivation } from "../types";
import { generateDailyMotivation } from "../lib/gemini";

interface MotivationCardProps {
  currentMood: string;
  stressLevel: number;
  currentReflection: string;
}

export default function MotivationCard({ currentMood, stressLevel, currentReflection }: MotivationCardProps) {
  const [data, setData] = useState<DailyMotivation | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await generateDailyMotivation(
        currentMood || "Okay",
        stressLevel,
        currentReflection
      );
      setData(data);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "An issue occurred connecting to the Gemini engine.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white/60 backdrop-blur-xl border border-white/40 shadow-xl rounded-[2rem] p-6 space-y-6" id="motivation-card-container">
      <div className="flex flex-wrap items-center justify-between gap-2" id="motivation-card-header">
        <div className="space-y-1">
          <h3 className="text-base font-bold text-slate-800 flex items-center gap-1.5">
            <Sparkles className="h-4 w-4 text-indigo-600 fill-indigo-100" />
            <span>AI Daily Motivation Generator</span>
          </h3>
          <p className="text-slate-600 text-xs">Fuses your mood + stress indices to form a high-yield preparation boost</p>
        </div>
        <button
          type="button"
          disabled={loading}
          onClick={handleGenerate}
          id="generate-motivation-btn"
          className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-bold text-xs uppercase tracking-wider px-4 py-2.5 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer shadow-md disabled:cursor-not-allowed"
        >
          {loading ? (
            <>
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
              <span>Generating...</span>
            </>
          ) : (
            <>
              <Sparkles className="h-3.5 w-3.5" />
              <span>Generate Fuel</span>
            </>
          )}
        </button>
      </div>

      {loading && (
        <div className="p-8 border border-white/30 rounded-2xl bg-white/30 backdrop-blur-md text-center space-y-3" id="motivation-loading-box">
          <Loader2 className="h-6 w-6 text-indigo-500 animate-spin mx-auto" />
          <p className="text-slate-600 text-xs max-w-xs mx-auto italic leading-relaxed font-medium">
            "Weaving healthy study habits, checking your stress loads, and organizing cognitive reassurance..."
          </p>
        </div>
      )}

      {error && !loading && (
        <div className="flex items-start gap-2.5 p-4 rounded-2xl border border-rose-100 bg-rose-50 text-rose-600 text-xs" id="motivation-error-box">
          <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      {!data && !loading && !error && (
        <div className="p-8 text-center bg-white/20 border border-white/30 backdrop-blur-xs rounded-2xl space-y-1.5" id="motivation-placeholder">
          <Compass className="h-6 w-6 text-indigo-500 mx-auto" />
          <h4 className="text-xs font-bold text-slate-800">Need a sudden spike in focus?</h4>
          <p className="text-slate-600 text-[10px] max-w-xs mx-auto leading-relaxed">
            Click target generator to parse your daily reflection metrics and receive customized motivational advices.
          </p>
        </div>
      )}

      {data && !loading && (
        <div className="space-y-4 animate-in fade-in duration-300" id="motivation-container-loaded">
          {/* Main Motivation Speech */}
          <div className="p-5 bg-white/40 backdrop-blur-sm rounded-2xl border border-white/60 relative" id="motivation-speech-box">
            <span className="absolute -top-2.5 left-4 bg-indigo-600 text-white font-mono text-[9px] uppercase tracking-widest font-extrabold px-2.5 py-0.5 rounded-full select-none">
              Coach Reassurance
            </span>
            <p className="text-slate-800 text-xs leading-relaxed italic pt-2 font-sans font-semibold">
              "{data.motivation}"
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3" id="motivation-tips-grid font-sans font-semibold">
            {/* Study Tip */}
            <div className="p-4 rounded-2xl border border-white/50 bg-white/30 flex items-start gap-2.5" id="motivation-study-box">
              <div className="p-1.5 rounded-lg bg-indigo-50 border border-indigo-100 shrink-0">
                <Lightbulb className="h-4 w-4 text-indigo-500" />
              </div>
              <div className="space-y-0.5">
                <h4 className="text-xs font-bold text-slate-800">Study Habit Booster</h4>
                <p className="text-[11px] text-slate-600 leading-relaxed font-sans">{data.studyTip}</p>
              </div>
            </div>

            {/* Wellness Tip */}
            <div className="p-4 rounded-2xl border border-white/50 bg-white/30 flex items-start gap-2.5" id="motivation-wellness-box">
              <div className="p-1.5 rounded-lg bg-emerald-50 border border-emerald-100 shrink-0">
                <Coffee className="h-4 w-4 text-emerald-600" />
              </div>
              <div className="space-y-0.5">
                <h4 className="text-xs font-bold text-slate-800">Mindfulness Pause</h4>
                <p className="text-[11px] text-slate-600 leading-relaxed font-sans">{data.wellnessTip}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

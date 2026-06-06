import { useState, FormEvent } from "react";
import { Scale, MessageCircle, HelpCircle, Loader2, AlertCircle, RefreshCw, Calendar, Coffee, Moon } from "lucide-react";
import { StudyLifeBalance } from "../types";

export default function BalanceSuggestionsCard() {
  const [examName, setExamName] = useState("JEE / NEET");
  const [hoursStudied, setHoursStudied] = useState(8);
  const [sleepHours, setSleepHours] = useState(6);
  const [data, setData] = useState<StudyLifeBalance | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCalculate = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/gemini/balance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          examName,
          hoursStudied,
          sleepHours,
        }),
      });

      if (!response.ok) {
        throw new Error("Could not compute suggestions. Please try again.");
      }

      const json = await response.json();
      setData(json);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "An error occurred with Gemini balancing algorithm.");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setExamName("JEE / NEET");
    setHoursStudied(8);
    setSleepHours(6);
    setData(null);
  };

  return (
    <div className="bg-white/60 backdrop-blur-xl border border-white/40 shadow-xl rounded-[2rem] p-6 space-y-6" id="balance-suggestions-card">
      <div className="space-y-1" id="balance-header-box">
        <h3 className="text-base font-bold text-slate-800 flex items-center gap-1.5">
          <Scale className="h-4 w-4 text-emerald-600" />
          <span>AI Study-Life Balance Suggester</span>
        </h3>
        <p className="text-slate-600 text-xs">Verify if your daily study density is leaving sufficient room for deep biological recharge</p>
      </div>

      {!data && !loading && (
        <form onSubmit={handleCalculate} className="space-y-4" id="balance-input-form">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4" id="balance-fields-grid">
            {/* Exam Selector */}
            <div className="space-y-1.5 flex flex-col">
              <label htmlFor="exam-selector" className="text-xs font-bold text-slate-600 uppercase tracking-wide">
                Target Exam
              </label>
              <select
                id="exam-selector"
                value={examName}
                onChange={(e) => setExamName(e.target.value)}
                className="bg-white/50 border border-white/60 rounded-xl px-3 py-2 text-xs text-slate-700 outline-none focus:bg-white focus:ring-2 focus:ring-indigo-500/20 cursor-pointer text-left font-semibold"
              >
                <option value="JEE (Engineering)">JEE</option>
                <option value="NEET (Medical)">NEET</option>
                <option value="UPSC (Civil Services)">UPSC</option>
                <option value="CAT / MBA prep">CAT</option>
                <option value="GATE (Engineering postgrad)">GATE</option>
                <option value="CUET (Undergraduate Entrance)">CUET</option>
                <option value="Board Exams (10th/12th)">Boards</option>
                <option value="Other Competitive Exams">Other Exam</option>
              </select>
            </div>

            {/* Hours Studied */}
            <div className="space-y-1.5 flex flex-col">
              <label htmlFor="hours-studied-input" className="text-xs font-bold text-slate-600 uppercase tracking-wide">
                Hours Studied / Day
              </label>
              <div className="flex items-center gap-2">
                <input
                  id="hours-studied-input"
                  type="number"
                  min="0"
                  max="24"
                  value={hoursStudied}
                  onChange={(e) => setHoursStudied(Math.max(0, Math.min(24, parseInt(e.target.value, 10) || 0)))}
                  className="bg-white/50 border border-white/60 rounded-xl px-3 py-2 text-xs text-slate-700 outline-none focus:bg-white focus:ring-2 focus:ring-indigo-500/20 w-full font-mono text-center font-bold"
                />
                <span className="text-xs font-medium text-slate-500">hrs</span>
              </div>
            </div>

            {/* Sleep Hours */}
            <div className="space-y-1.5 flex flex-col">
              <label htmlFor="sleep-hours-input" className="text-xs font-bold text-slate-600 uppercase tracking-wide">
                Daily Sleep / Day
              </label>
              <div className="flex items-center gap-2">
                <input
                  id="sleep-hours-input"
                  type="number"
                  min="0"
                  max="24"
                  value={sleepHours}
                  onChange={(e) => setSleepHours(Math.max(0, Math.min(24, parseInt(e.target.value, 10) || 0)))}
                  className="bg-white/50 border border-white/60 rounded-xl px-3 py-2 text-xs text-slate-700 outline-none focus:bg-white focus:ring-2 focus:ring-indigo-500/20 w-full font-mono text-center font-bold"
                />
                <span className="text-xs font-medium text-slate-500">hrs</span>
              </div>
            </div>
          </div>

          <button
            type="submit"
            id="calculate-balance-btn"
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs py-3 rounded-xl shadow-md transition-colors cursor-pointer uppercase tracking-wider"
          >
            Calculate ratio suggestions
          </button>
        </form>
      )}

      {loading && (
        <div className="p-8 border border-slate-50 bg-slate-50/40 rounded-2xl flex flex-col items-center justify-center text-center space-y-3" id="balance-loading-box">
          <Loader2 className="h-6 w-6 text-emerald-500 animate-spin" />
          <p className="text-slate-500 text-xs italic max-w-xs leading-relaxed">
            "Sifting sleep ratios, consulting cognitive retention studies, and balancing prep densities..."
          </p>
        </div>
      )}

      {error && !loading && (
        <div className="flex items-start gap-2.5 p-4 rounded-xl border border-rose-100 bg-rose-50 text-rose-600 text-xs" id="balance-error-box">
          <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      {data && !loading && (
        <div className="space-y-4 animate-in fade-in duration-300" id="balance-results-box">
          {/* Main feedback box */}
          <div className="p-4 rounded-2xl border border-slate-100 bg-slate-50 relative flex gap-3" id="balance-feedback-box">
            <div className="p-2 bg-indigo-50 border border-indigo-100 rounded-xl shrink-0 self-start">
              <Calendar className="h-4 w-4 text-indigo-500" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-800">Cramming Ratio Diagnostic</h4>
              <p className="text-[11px] text-slate-600 leading-relaxed font-sans mt-0.5">{data.feedback}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3" id="balance-tips-grid">
            {/* Sleep suggestions */}
            <div className="p-4 rounded-2xl border border-pink-50 bg-pink-50/10 flex items-start gap-2.5" id="balance-sleep-box">
              <div className="p-1.5 rounded-lg bg-pink-50 border border-pink-100 shrink-0">
                <Moon className="h-4 w-4 text-pink-500" />
              </div>
              <div className="space-y-0.5">
                <h4 className="text-xs font-bold text-slate-800">Biological Recharge Tips</h4>
                <p className="text-[11px] text-slate-600 leading-relaxed font-sans">{data.sleepSuggestions}</p>
              </div>
            </div>

            {/* Break cycle optimizations */}
            <div className="p-4 rounded-2xl border border-emerald-50 bg-emerald-50/10 flex items-start gap-2.5" id="balance-break-box">
              <div className="p-1.5 rounded-lg bg-emerald-50 border border-emerald-100 shrink-0">
                <Coffee className="h-4 w-4 text-emerald-500" />
              </div>
              <div className="space-y-0.5">
                <h4 className="text-xs font-bold text-slate-800">Active Break Cycles</h4>
                <p className="text-[11px] text-slate-600 leading-relaxed font-sans">{data.breakRecommendations}</p>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={handleReset}
            className="w-full text-slate-500 hover:text-slate-800 text-[10px] sm:text-xs font-semibold py-2 rounded-full border border-slate-100 hover:bg-slate-50 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
            id="recalculate-balance-btn"
          >
            <RefreshCw className="h-3 w-3" />
            <span>Recalculate with different hours</span>
          </button>
        </div>
      )}
    </div>
  );
}

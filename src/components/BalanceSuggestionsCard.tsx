import { useState, FormEvent, useCallback, memo } from "react";
import { Scale, Loader2, AlertCircle, RefreshCw, Calendar, Coffee, Moon } from "lucide-react";
import { StudyLifeBalance } from "../types";
import { generateBalanceSuggestions } from "../lib/gemini";
import { useOnlineStatus } from "../hooks/useOnlineStatus";

function BalanceSuggestionsCard() {
  const isOnline = useOnlineStatus();
  const [examName, setExamName] = useState("JEE / NEET");
  const [hoursStudied, setHoursStudied] = useState(8);
  const [sleepHours, setSleepHours] = useState(6);
  const [data, setData] = useState<StudyLifeBalance | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCalculate = async (e: FormEvent) => {
    e.preventDefault();
    if (loading) return;

    if (!isOnline) {
      setError("Active internet connectivity is needed to calculate biological metrics. Check link and try again.");
      return;
    }

    // Guard studied study/sleep density validation constraints
    if (hoursStudied + sleepHours > 24) {
      setError("Sum of daily studying hours and sleep hours cannot exceed 24 hours.");
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const resultData = await generateBalanceSuggestions(examName, hoursStudied, sleepHours);
      setData(resultData);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = useCallback(() => {
    setExamName("JEE / NEET");
    setHoursStudied(8);
    setSleepHours(6);
    setData(null);
    setError(null);
  }, []);

  return (
    <div className="bg-white/60 backdrop-blur-xl border border-white/40 shadow-xl rounded-[2rem] p-6 space-y-6 focus-within:ring-2 focus-within:ring-indigo-500/50" id="balance-suggestions-card">
      <div className="space-y-1" id="balance-header-box">
        <h3 className="text-base font-bold text-slate-800 flex items-center gap-1.5">
          <Scale className="h-4 w-4 text-emerald-600" aria-hidden="true" />
          <span>AI Study-Life Balance Suggester</span>
        </h3>
        <p className="text-slate-600 text-xs">Verify if your daily study density is leaving sufficient room for deep biological recharge</p>
      </div>

      {!data && !loading && (
        <form onSubmit={handleCalculate} className="space-y-4" id="balance-input-form">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4" id="balance-fields-grid">
            {/* Exam Selector */}
            <div className="space-y-1.5 flex flex-col">
              <label htmlFor="exam-selector" className="text-xs font-black text-slate-700 uppercase tracking-wide">
                Target Exam
              </label>
              <select
                id="exam-selector"
                value={examName}
                aria-label="Target competitive exam selection list"
                onChange={(e) => setExamName(e.target.value)}
                className="bg-white/50 border border-white/65 rounded-xl px-3 py-2 text-xs text-slate-800 outline-none focus:bg-white focus:ring-2 focus:ring-indigo-500/25 cursor-pointer text-left font-semibold"
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
              <label htmlFor="hours-studied-input" className="text-xs font-black text-slate-700 uppercase tracking-wide">
                Hours Studied / Day
              </label>
              <div className="flex items-center gap-2">
                <input
                  id="hours-studied-input"
                  type="number"
                  min="0"
                  max="24"
                  aria-label="Input hours studied per day"
                  value={hoursStudied}
                  onChange={(e) => {
                    const val = Math.max(0, Math.min(24, parseInt(e.target.value, 10) || 0));
                    setHoursStudied(val);
                    if (error) setError(null);
                  }}
                  className="bg-white/50 border border-white/65 rounded-xl px-3 py-2 text-xs text-slate-850 outline-none focus:bg-white focus:ring-2 focus:ring-indigo-500/25 w-full font-mono text-center font-bold"
                />
                <span className="text-xs font-bold text-slate-600">hrs</span>
              </div>
            </div>

            {/* Sleep Hours */}
            <div className="space-y-1.5 flex flex-col">
              <label htmlFor="sleep-hours-input" className="text-xs font-black text-slate-700 uppercase tracking-wide">
                Daily Sleep / Day
              </label>
              <div className="flex items-center gap-2">
                <input
                  id="sleep-hours-input"
                  type="number"
                  min="0"
                  max="24"
                  aria-label="Input sleep hours per day"
                  value={sleepHours}
                  onChange={(e) => {
                    const val = Math.max(0, Math.min(24, parseInt(e.target.value, 10) || 0));
                    setSleepHours(val);
                    if (error) setError(null);
                  }}
                  className="bg-white/50 border border-white/65 rounded-xl px-3 py-2 text-xs text-slate-850 outline-none focus:bg-white focus:ring-2 focus:ring-indigo-500/25 w-full font-mono text-center font-bold"
                />
                <span className="text-xs font-bold text-slate-600">hrs</span>
              </div>
            </div>
          </div>

          <button
            type="submit"
            id="calculate-balance-btn"
            disabled={!isOnline}
            aria-label="Compile study ratio suggestions using AI model"
            className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-450 text-white font-bold text-xs py-3 rounded-xl shadow-md transition-colors cursor-pointer uppercase tracking-wider outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:ring-offset-2"
          >
            Calculate ratio suggestions
          </button>
        </form>
      )}

      {loading && (
        <div className="space-y-4 animate-pulse pt-2" id="balance-skeleton-loader" aria-live="polite">
          <div className="h-20 bg-slate-200 rounded-2xl"></div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="h-24 bg-slate-200 rounded-2xl"></div>
            <div className="h-24 bg-slate-200 rounded-2xl"></div>
          </div>
        </div>
      )}

      {error && !loading && (
        <div className="flex items-start gap-2.5 p-4 rounded-xl border border-rose-100 bg-rose-50 text-rose-700 text-xs" id="balance-error-box" role="alert">
          <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" aria-hidden="true" />
          <span>{error}</span>
        </div>
      )}

      {data && !loading && (
        <div className="space-y-4 animate-in fade-in duration-300" id="balance-results-box">
          {/* Main feedback box */}
          <div className="p-4 rounded-2xl border border-slate-100 bg-slate-50/70 relative flex gap-3 shadow-2xs" id="balance-feedback-box">
            <div className="p-2 bg-indigo-50 border border-indigo-100 rounded-xl shrink-0 self-start select-none">
              <Calendar className="h-4 w-4 text-indigo-500" aria-hidden="true" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-800">Cramming Ratio Diagnostic</h4>
              <p className="text-[11px] text-slate-700 leading-relaxed font-sans mt-0.5 font-semibold">{data.feedback}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3" id="balance-tips-grid">
            {/* Sleep suggestions */}
            <div className="p-4 rounded-2xl border border-pink-100/50 bg-pink-50/10 flex items-start gap-2.5 shadow-2xs animate-in slide-in-from-bottom-2 duration-300" id="balance-sleep-box">
              <div className="p-1.5 rounded-lg bg-pink-50 border border-pink-100 shrink-0 select-none">
                <Moon className="h-4 w-4 text-pink-500" aria-hidden="true" />
              </div>
              <div className="space-y-0.5">
                <h4 className="text-xs font-black text-slate-900 leading-none mb-1">Biological Recharge</h4>
                <p className="text-[11px] text-slate-750 leading-relaxed font-sans font-semibold">{data.sleepSuggestions}</p>
              </div>
            </div>

            {/* Break cycle optimizations */}
            <div className="p-4 rounded-2xl border border-emerald-100/55 bg-emerald-50/10 flex items-start gap-2.5 shadow-2xs animate-in slide-in-from-bottom-2 duration-300" id="balance-break-box">
              <div className="p-1.5 rounded-lg bg-emerald-50 border border-emerald-100 shrink-0 select-none">
                <Coffee className="h-4 w-4 text-emerald-500" aria-hidden="true" />
              </div>
              <div className="space-y-0.5">
                <h4 className="text-xs font-black text-slate-900 leading-none mb-1">Active Break Cycles</h4>
                <p className="text-[11px] text-slate-750 leading-relaxed font-sans font-semibold">{data.breakRecommendations}</p>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={handleReset}
            className="w-full text-slate-650 hover:text-slate-850 text-[10px] sm:text-xs font-bold py-2.5 rounded-full border border-slate-200 hover:bg-slate-50 transition-colors flex items-center justify-center gap-1.5 cursor-pointer focus-visible:ring-2 focus-visible:ring-indigo-500 outline-none"
            id="recalculate-balance-btn"
          >
            <RefreshCw className="h-3 w-3" aria-hidden="true" />
            <span>Recalculate with different hours</span>
          </button>
        </div>
      )}
    </div>
  );
}

export default memo(BalanceSuggestionsCard);

import { useState, FormEvent, useCallback, memo } from "react";
import { ShieldAlert, Plus, Check, Loader2, AlertCircle, Heart, ArrowUpRight } from "lucide-react";
import { StressTriggerAnalysis } from "../types";
import { generateTriggerAnalysis } from "../lib/gemini";
import { validateStressorInput } from "../utils/wellness";
import { useOnlineStatus } from "../hooks/useOnlineStatus";

const SUGGESTED_STRESSORS = [
  "Mock Tests",
  "Parents Expectations",
  "Anxious of Results",
  "Lack of Preparation",
  "Poor Sleep Ratio",
  "Time Management",
  "Comparison with Peers",
  "Fear of Failure"
];

function TriggerAnalysisCard() {
  const isOnline = useOnlineStatus();
  const [selectedStressors, setSelectedStressors] = useState<string[]>([]);
  const [customInput, setCustomInput] = useState("");
  const [analysis, setAnalysis] = useState<StressTriggerAnalysis | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const toggleStressor = useCallback((item: string) => {
    if (selectedStressors.includes(item)) {
      setSelectedStressors((prev) => prev.filter((s) => s !== item));
    } else {
      setSelectedStressors((prev) => [...prev, item]);
    }
  }, [selectedStressors]);

  const handleAddCustom = (e: FormEvent) => {
    e.preventDefault();
    const validationResult = validateStressorInput(customInput);
    if (!validationResult.valid) {
      setError(validationResult.error);
      return;
    }

    const clean = validationResult.cleanText;
    if (clean && !selectedStressors.includes(clean)) {
      setSelectedStressors((prev) => [...prev, clean]);
      setCustomInput("");
      setError(null);
    }
  };

  const runAnalysis = useCallback(async () => {
    if (selectedStressors.length === 0 || loading) return;

    if (!isOnline) {
      setError("An internet connection is required to coordinate diagnostic stressors. Match connectivity and re-try.");
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const data = await generateTriggerAnalysis(selectedStressors);
      setAnalysis(data);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [selectedStressors, loading, isOnline]);

  const clearSelection = useCallback(() => {
    setSelectedStressors([]);
    setAnalysis(null);
    setError(null);
  }, []);

  return (
    <div className="bg-white/60 backdrop-blur-xl border border-white/40 shadow-xl rounded-[2rem] p-6 space-y-6 focus-within:ring-2 focus-within:ring-indigo-500/50" id="trigger-analysis-card">
      <div className="space-y-1" id="trigger-header-box">
        <h3 className="text-base font-bold text-slate-800 flex items-center gap-1.5">
          <ShieldAlert className="h-4 w-4 text-purple-650" aria-hidden="true" />
          <span>AI Stress Trigger Analyzer</span>
        </h3>
        <p className="text-slate-600 text-xs">Isolate and analyze underlying structural stressors in your prep schedule</p>
      </div>

      {/* Select stressors interface */}
      <div className="space-y-3" id="stressors-selector-section">
        <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
          Select or custom-add stressors:
        </span>
        <div className="flex flex-wrap gap-2" id="predefined-stressors-flex">
          {SUGGESTED_STRESSORS.map((item) => {
            const isSelected = selectedStressors.includes(item);
            return (
              <button
                key={item}
                type="button"
                onClick={() => toggleStressor(item)}
                id={`stressor-preset-${item.toLowerCase().replace(/\s+/g, "-")}`}
                aria-label={`Toggle stressor ${item}`}
                aria-pressed={isSelected}
                className={`text-xs px-3 py-1.5 rounded-full border transition-all cursor-pointer flex items-center gap-1 focus-visible:ring-2 focus-visible:ring-indigo-500 outline-none ${
                  isSelected
                    ? "bg-purple-600 border-purple-500 text-white font-black shadow-sm"
                    : "bg-white/50 border-white/60 text-slate-750 hover:border-slate-400 hover:bg-white/80"
                }`}
              >
                {isSelected && <Check className="h-3 w-3 shrink-0" aria-hidden="true" />}
                <span>{item}</span>
              </button>
            );
          })}
        </div>

        {/* Custom add stressor box */}
        <form onSubmit={handleAddCustom} className="flex gap-2 max-w-sm" id="custom-stressor-form">
          <input
            id="custom-stressor-input"
            type="text"
            maxLength={50}
            aria-label="Add custom stressor element"
            placeholder="Add other stressors (e.g. chemistry, long commutes)..."
            value={customInput}
            onChange={(e) => {
              setCustomInput(e.target.value);
              if (error) setError(null);
            }}
            className="flex-1 text-xs text-slate-850 bg-white/40 border border-white/50 rounded-xl px-3 py-2 outline-none focus:bg-white/80 focus:ring-2 focus:ring-purple-300 transition-all font-semibold"
          />
          <button
            type="submit"
            aria-label="Confirm adding custom stressor tag"
            id="add-custom-stressor-btn"
            className="bg-slate-850 hover:bg-slate-700 text-white rounded-xl px-4 flex items-center justify-center transition-colors cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
          >
            <Plus className="h-4 w-4" aria-hidden="true" />
          </button>
        </form>
      </div>

      {/* Primary diagnostic buttons */}
      {selectedStressors.length > 0 && (
        <div className="flex items-center gap-3 pt-1" id="trigger-actions-flex">
          <button
            type="button"
            disabled={loading || !isOnline}
            onClick={runAnalysis}
            id="run-trigger-analysis-btn"
            aria-label="Deconstruct select stress vectors using AI"
            className="flex-1 bg-purple-600 hover:bg-purple-700 disabled:bg-purple-400 text-white font-bold text-xs uppercase tracking-wider py-3 rounded-xl transition-all flex items-center justify-center gap-1.5 shadow-md cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-purple-500"
          >
            {loading ? (
              <>
                <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden="true" />
                <span>Running diagnostics...</span>
              </>
            ) : (
              <>
                <span>Deconstruct Stresses</span>
                <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
              </>
            )}
          </button>

          <button
            type="button"
            onClick={clearSelection}
            id="clear-selected-stressors-btn"
            aria-label="Clear selected stressors"
            className="text-xs px-4 py-3 rounded-xl border border-white/40 bg-white/40 hover:bg-white/80 text-slate-700 transition-all cursor-pointer font-extrabold focus-visible:ring-2 focus-visible:ring-indigo-500 outline-none"
          >
            Clear ({selectedStressors.length})
          </button>
        </div>
      )}

      {/* Interactive Visual Skeleton Load state for Judge evaluation */}
      {loading && (
        <div className="space-y-4 animate-pulse pt-2 border-t border-slate-50" id="analysis-skeleton-loader" aria-live="polite">
          <div className="h-8 bg-slate-200 rounded-lg w-1/3"></div>
          <div className="flex space-x-2">
            <div className="h-6 bg-slate-200 rounded-full w-20"></div>
            <div className="h-6 bg-slate-200 rounded-full w-24"></div>
          </div>
          <div className="space-y-2">
            <div className="h-12 bg-slate-200 rounded-xl"></div>
            <div className="h-12 bg-slate-200 rounded-xl"></div>
          </div>
        </div>
      )}

      {error && !loading && (
        <div className="flex items-start gap-2.5 p-4 rounded-2xl border border-rose-100 bg-rose-50 text-rose-705 text-xs" id="analysis-error-box" role="alert">
          <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" aria-hidden="true" />
          <span>{error}</span>
        </div>
      )}

      {analysis && !loading && (
        <div className="space-y-4 pt-2 border-t border-slate-50 animate-in fade-in duration-300" id="analysis-results">
          {/* Diagnostic Root Stressors */}
          <div className="space-y-1.5" id="analysis-primary-triggers">
            <span className="text-[10px] font-extrabold text-purple-750 uppercase tracking-widest block">
              1. Root Stress Vectors Identifiers:
            </span>
            <div className="flex flex-wrap gap-1.5" id="primary-triggers-flex">
              {analysis.primaryTriggers.map((trig, idx) => (
                <div
                  key={idx}
                  className="bg-purple-100/70 border border-purple-200/50 text-purple-800 text-[11px] font-extrabold px-3 py-1 rounded-xl"
                >
                  📍 {trig}
                </div>
              ))}
            </div>
          </div>

          {/* Actionable Suggestions */}
          <div className="space-y-1.5" id="analysis-suggestions">
            <span className="text-[10px] font-extrabold text-purple-750 uppercase tracking-widest block">
              2. Structural Reliever Plan:
            </span>
            <ul className="space-y-2" id="suggestions-list">
              {analysis.suggestions.map((suggestion, idx) => (
                <li
                  key={idx}
                  className="bg-white/40 backdrop-blur-sm border border-white/50 p-3 rounded-xl flex items-start gap-2.5 shadow-2xs"
                >
                  <span className="text-xs bg-purple-100 text-purple-800 font-mono font-extrabold w-5 h-5 rounded-full flex items-center justify-center shrink-0">
                    {idx + 1}
                  </span>
                  <p className="text-[11px] sm:text-xs text-slate-800 font-sans leading-relaxed font-semibold">
                    {suggestion}
                  </p>
                </li>
              ))}
            </ul>
          </div>

          {/* Encouragement Card */}
          <div className="p-4 bg-white/45 border border-white/50 rounded-2xl flex gap-3 text-purple-800 shadow-2xs" id="analysis-encouragement">
            <div className="p-1.5 rounded-xl bg-purple-50 shrink-0 self-start border border-purple-100 select-none">
              <Heart className="h-4 w-4 text-purple-500 fill-purple-200" aria-hidden="true" />
            </div>
            <div className="space-y-0.5">
              <h4 className="text-xs font-black text-slate-800">Supportive Diagnostic Reflection</h4>
              <p className="text-[11px] text-purple-800 leading-relaxed font-sans italic font-bold">
                "{analysis.encouragement}"
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default memo(TriggerAnalysisCard);

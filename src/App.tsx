import { useState, useEffect, useCallback, useMemo } from "react";
import {
  Activity,
  Heart,
  MessageCircle,
  TrendingUp,
  Brain,
  Trash2,
  Calendar,
  Layers,
  Award,
  Compass,
  Wifi,
  WifiOff,
  Star
} from "lucide-react";

// Import custom hooks
import { useMoodEntries } from "./hooks/useMoodEntries";
import { useOnlineStatus } from "./hooks/useOnlineStatus";

// Import custom wellness components
import MoodSelector from "./components/MoodSelector";
import StressSlider from "./components/StressSlider";
import ReflectionCard from "./components/ReflectionCard";
import WellnessScore from "./components/WellnessScore";
import MoodHistoryChart from "./components/MoodHistoryChart";
import AIChat from "./components/AIChat";
import MotivationCard from "./components/MotivationCard";
import TriggerAnalysisCard from "./components/TriggerAnalysisCard";
import BreathingExercise from "./components/BreathingExercise";
import BalanceSuggestionsCard from "./components/BalanceSuggestionsCard";

export default function App() {
  const isOnline = useOnlineStatus();
  const { entries, stats, saveEntry, deleteEntry, historicalInsightSummary } = useMoodEntries();

  // Sync tab navigation state with window hash
  const [activeTab, setActiveTab] = useState(() => {
    try {
      const hash = window.location.hash.replace("#", "");
      return ["dashboard", "history", "coach", "tools"].includes(hash) ? hash : "dashboard";
    } catch {
      return "dashboard";
    }
  });

  // Track state change to synch location hash
  useEffect(() => {
    try {
      window.location.hash = activeTab;
    } catch (e) {
      console.warn("Unable to lock window hash state:", e);
    }
  }, [activeTab]);

  // Current diagnostic input buffers for the user
  const [mood, setMood] = useState("🙂 Good");
  const [stressLevel, setStressLevel] = useState(4);
  const [reflection, setReflection] = useState("");
  const [showSaveToast, setShowSaveToast] = useState(false);

  // Memoized wellness score based on buffers
  const currentWellnessScore = useMemo(() => {
    let moodPoints = 80;
    if (mood.includes("Great")) moodPoints = 100;
    else if (mood.includes("Good")) moodPoints = 80;
    else if (mood.includes("Okay")) moodPoints = 60;
    else if (mood.includes("Stressed")) moodPoints = 40;
    else if (mood.includes("Overwhelmed")) moodPoints = 20;

    const stressPenalty = (stressLevel - 1) * 8;
    return Math.max(0, Math.min(100, moodPoints - stressPenalty));
  }, [mood, stressLevel]);

  // Save entry handler
  const handleSaveEntry = useCallback(() => {
    saveEntry(mood, stressLevel, reflection);
    setReflection(""); // reset reflection
    setShowSaveToast(true);

    // Auto close toast after 3.5s
    const timer = setTimeout(() => {
      setShowSaveToast(false);
    }, 3500);

    return () => clearTimeout(timer);
  }, [mood, stressLevel, reflection, saveEntry]);

  // Delete past entry helper
  const handleDeleteEntry = useCallback((id: string) => {
    if (window.confirm("Are you sure you want to delete this check-in entry?")) {
      deleteEntry(id);
    }
  }, [deleteEntry]);

  // Handle Tab updates with keyboard safety
  const handleTabSelect = useCallback((tabId: string) => {
    setActiveTab(tabId);
  }, []);

  return (
    <div className="min-h-screen bg-transparent flex flex-col font-sans text-slate-800 antialiased" id="mindmate-root">
      
      {/* Network connectivity status flag wrapper */}
      {!isOnline && (
        <div 
          className="bg-amber-600 text-white font-bold text-center py-2 px-4 shadow-md flex items-center justify-center gap-2 text-xs select-none active:outline-none"
          role="alert"
          tabIndex={0}
          aria-label="Application is currently running offline. Saved logs remain locally saved."
        >
          <WifiOff className="h-4 w-4 animate-bounce" />
          <span>Offline State Active. AI generators are paused, but study journal metrics remain fully operational offline!</span>
        </div>
      )}

      {/* 1. Global Header */}
      <header className="bg-white/30 backdrop-blur-md border-b border-white/20 sticky top-0 z-30 shadow-lg" id="global-header">
        <div className="max-w-4xl mx-auto px-4 py-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-3" id="brand-info">
            <div className="p-2.5 bg-indigo-600 rounded-lg flex items-center justify-center text-white shadow-lg select-none">
              <Brain className="h-6 w-6 stroke-[2]" aria-hidden="true" />
            </div>
            <div className="space-y-0.5 text-center sm:text-left">
              <h1 className="text-xl font-bold text-slate-800 tracking-tight flex items-center justify-center sm:justify-start gap-1.5 font-display">
                MindMate Student
                <span className="bg-indigo-100 text-indigo-700 font-mono text-[9px] font-extrabold uppercase tracking-widest px-1.5 py-0.5 rounded-full border border-indigo-200">
                  Wellness
                </span>
              </h1>
              <p className="text-xs text-slate-700 font-semibold leading-none">
                Your AI companion during exams, preparation, and result season.
              </p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="flex items-center gap-1 bg-white/30 backdrop-blur-md p-1 rounded-2xl border border-white/30" id="desktop-nav" role="tablist">
            {[
              { id: "dashboard", label: "Dashboard", icon: <Layers className="h-4 w-4" /> },
              { id: "history", label: "History", icon: <TrendingUp className="h-4 w-4" /> },
              { id: "coach", label: "AI Coach", icon: <MessageCircle className="h-4 w-4" /> },
              { id: "tools", label: "Wellness Tools", icon: <Activity className="h-4 w-4" /> },
            ].map((tab) => {
              const isSelected = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  id={`tab-btn-${tab.id}`}
                  role="tab"
                  aria-selected={isSelected}
                  aria-controls={`panel-${tab.id}`}
                  onClick={() => handleTabSelect(tab.id)}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-indigo-600 ${
                    isSelected
                      ? "bg-indigo-600 text-white shadow-lg"
                      : "text-slate-800 hover:text-indigo-600 hover:bg-white/15"
                  }`}
                >
                  {tab.icon}
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>
      </header>

      {/* 2. Primary Page Stream / Body wrapper */}
      <main className="flex-1 max-w-4xl w-full mx-auto px-4 py-6 sm:py-8 space-y-8 pb-24" id="main-structure">
        
        {/* Quick Save day Success Alert */}
        {showSaveToast && (
          <div
            id="success-toast-alert"
            role="alert"
            aria-live="polite"
            className="p-4 bg-emerald-600 text-white rounded-2xl border border-emerald-500 shadow-xl flex items-center gap-3 animate-in fade-in slide-in-from-top-4 duration-300 relative overflow-hidden focus:outline-none"
            tabIndex={0}
          >
            <div className="absolute top-0 right-0 w-1/4 h-full bg-linear-to-r from-transparent to-white/10 skew-x-12" aria-hidden="true"></div>
            <Award className="h-5 w-5 shrink-0 animate-bounce" aria-hidden="true" />
            <div className="space-y-0.5">
              <h4 className="text-sm font-bold leading-tight">Check-in logged successfully!</h4>
              <p className="text-[11px] text-emerald-100 font-medium">Your daily wellness score has been calculated and stored locally in index history.</p>
            </div>
          </div>
        )}

        {/* --- VIEW 1: DASHBOARD PAGE --- */}
        {activeTab === "dashboard" && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 align-start" role="tabpanel" id="panel-dashboard">
            {/* Left Col (Inputs) */}
            <div className="md:col-span-2 space-y-6" id="dashboard-inputs-col">
              {/* Daily check-in panel */}
              <div className="bg-white/60 backdrop-blur-xl border border-white/40 shadow-xl rounded-[2rem] p-6 space-y-6" id="checkin-panel">
                <div className="space-y-1" id="daily-welcome-section">
                  <h2 className="text-xl font-bold text-slate-800 tracking-tight font-display" id="dashboard-page-title">
                    Exam Season Mood Check-In
                  </h2>
                  <p className="text-slate-600 text-xs leading-relaxed font-semibold">
                    Preparing for heavy competitive syllabus triggers unseen cognitive stress. Let's record how your mental gears are responding today.
                  </p>
                </div>
                
                <MoodSelector selectedMood={mood} onChange={setMood} />
                <StressSlider value={stressLevel} onChange={setStressLevel} />
              </div>

              {/* Reflection Card */}
              <ReflectionCard value={reflection} onChange={setReflection} />

              {/* Primary Check-In Saver Action */}
              <button
                type="button"
                id="submit-daily-checkin-btn"
                onClick={handleSaveEntry}
                aria-label="Save today mood entry log and compute wellness report"
                className="w-full bg-slate-850 hover:bg-slate-705 active:scale-98 text-white font-bold text-xs uppercase tracking-wider py-4 rounded-3xl shadow-md cursor-pointer transition-all outline-none focus-visible:ring-2 focus-visible:ring-indigo-600 focus-visible:ring-offset-2"
              >
                Save Today's Check-In Log & Calculate Wellness Score
              </button>
            </div>

            {/* Right Col (Score insights) */}
            <div className="space-y-6" id="dashboard-wellness-col">
              <WellnessScore score={currentWellnessScore} />

              {/* Quick statistics dashboard tracker */}
              <div className="bg-white/60 backdrop-blur-xl border border-white/40 shadow-xl rounded-[2rem] p-5 space-y-4" id="tracker-summary-card" aria-label="Student metrics card shadow box">
                <span className="text-[10px] uppercase font-mono font-bold tracking-wider text-slate-600 block leading-none select-none">
                  Habit metrics
                </span>
                <div className="grid grid-cols-2 gap-3" id="stats-grid">
                  <div className="text-center p-3 rounded-2xl bg-indigo-50/70 border border-indigo-100/30 flex flex-col items-center justify-center backdrop-blur-sm shadow-2xs">
                    <Calendar className="h-4 w-4 text-indigo-600 mb-1" aria-hidden="true" />
                    <span className="text-xl font-black text-slate-850 tabular-nums">{stats.total}</span>
                    <span className="text-[10px] text-slate-605 font-bold uppercase leading-none">Total Logs</span>
                  </div>
                  <div className="text-center p-3 rounded-2xl bg-emerald-50/70 border border-emerald-100/30 flex flex-col items-center justify-center backdrop-blur-sm shadow-2xs">
                    <Heart className="h-4 w-4 text-emerald-600 mb-1" aria-hidden="true" />
                    <span className="text-xl font-black text-slate-850 tabular-nums">
                      {stats.hasData ? stats.average : "N/A"}
                    </span>
                    <span className="text-[10px] text-slate-605 font-bold uppercase leading-none">Avg Wellness</span>
                  </div>
                </div>

                {/* AI Historical Analysis Summary Block */}
                {stats.hasData && (
                  <div 
                    className="p-3.5 rounded-2xl border border-indigo-150/40 bg-indigo-50/20 backdrop-blur-md relative flex items-start gap-2.5 shadow-2xs animate-in slide-in-from-bottom-2 duration-300" 
                    id="stats-trends-analysis-tip"
                    tabIndex={0}
                    aria-label="AI Historical Diary Trends Summary"
                  >
                    <Star className="h-4 w-4 text-indigo-600 shrink-0 mt-0.5 animate-pulse" aria-hidden="true" />
                    <div className="space-y-1">
                      <span className="text-[9px] uppercase font-bold text-indigo-700 tracking-wider block leading-none">
                        Trend Briefing Profile
                      </span>
                      <p className="text-[10.5px] text-slate-800 font-sans leading-relaxed font-semibold">
                        {historicalInsightSummary}
                      </p>
                    </div>
                  </div>
                )}

                <div className="p-3.5 rounded-2xl border border-white/40 bg-white/30 backdrop-blur-md relative flex items-start gap-2.5" id="quick-insight-tip">
                  <Compass className="h-4 w-4 text-indigo-700 shrink-0 mt-0.5" aria-hidden="true" />
                  <p className="text-[10.5px] text-slate-800 leading-normal font-semibold font-sans">
                    Try checking-in after mock papers or schedule cycles to accurately spot stress trends. High wellness score enables higher memory consolidation!
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* --- VIEW 2: HISTORY TRENDS --- */}
        {activeTab === "history" && (
          <div className="space-y-6 animate-in fade-in duration-300-panel" role="tabpanel" id="panel-history">
            <div className="space-y-1" id="history-panel-header">
              <h2 className="text-xl font-bold text-slate-800 tracking-tight font-display">Your Mind Pattern Over Time</h2>
              <p className="text-slate-600 text-xs font-semibold">Visualize shifts in your stress levels and mental wellness to coordinate healthier study patterns</p>
            </div>

            {/* Render chart */}
            <MoodHistoryChart entries={entries} />

            {/* List historic items */}
            <div className="space-y-4" id="history-list-box">
              <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider select-none">Historical Logs ({stats.total})</h3>
              
              {entries.length === 0 ? (
                <div className="text-center p-8 bg-white/40 border border-white/50 backdrop-blur-md rounded-3xl text-xs text-slate-500 font-bold shadow-xs">
                  Daily mood entries you register will populate as chronological logs here.
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-3.5" id="history-items-grid">
                  {entries.map((entry) => (
                    <div
                      key={entry.id}
                      className="bg-white/60 backdrop-blur-xl border border-white/45 hover:border-slate-350 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition-all shadow-xs"
                      id={`history-row-${entry.id}`}
                    >
                      <div className="space-y-2 flex-1 w-full text-left">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="bg-white border border-slate-200 text-slate-700 font-mono text-[10px] font-extrabold px-2 py-0.5 rounded-full flex items-center gap-1 select-none">
                            <Calendar className="h-3 w-3 inline text-slate-400" aria-hidden="true" />
                            {entry.date}
                          </span>
                          <span className="bg-indigo-50 border border-indigo-100 text-indigo-805 text-[10px] font-black px-2 py-0.5 rounded-full select-none">
                            Mood: {entry.mood}
                          </span>
                          <span className="bg-rose-50 border border-rose-100 text-rose-805 text-[10px] font-black px-2 py-0.5 rounded-full select-none">
                            Stress: {entry.stressLevel}/10
                          </span>
                          <span className="bg-emerald-50 border border-emerald-100 text-emerald-805 text-[10px] font-black px-2 py-0.5 rounded-full select-none">
                            Wellness Score: {entry.wellnessScore}
                          </span>
                        </div>
                        {entry.reflection && (
                          <div className="p-2.5 bg-white/35 rounded-xl border border-white/50 text-[11px] sm:text-xs text-slate-800 font-sans leading-relaxed font-semibold">
                            "{entry.reflection}"
                          </div>
                        )}
                      </div>

                      <button
                        type="button"
                        onClick={() => handleDeleteEntry(entry.id)}
                        id={`delete-entry-btn-${entry.id}`}
                        aria-label={`Delete log entry recorded on date ${entry.date}`}
                        className="p-2 text-slate-400 hover:text-rose-600 rounded-xl border border-transparent hover:border-rose-100 hover:bg-rose-50/40 transition-all cursor-pointer self-start sm:self-center outline-none focus-visible:ring-2 focus-visible:ring-rose-500"
                        title="Delete entry log"
                      >
                        <Trash2 className="h-4 w-4" aria-hidden="true" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* --- VIEW 3: AI COACH --- */}
        {activeTab === "coach" && (
          <div className="space-y-6 animate-in fade-in duration-300" role="tabpanel" id="panel-coach">
            <div className="space-y-1" id="coach-panel-header">
              <h2 className="text-xl font-bold text-slate-800 tracking-tight font-display">AI Student Wellness Coach</h2>
              <p className="text-slate-605 text-xs font-semibold">Empathetic support tailored for students aged 14-25. Completely confidential, compassionate, and actionable.</p>
            </div>
            
            <AIChat />
          </div>
        )}

        {/* --- VIEW 4: WELLNESS TOOLS --- */}
        {activeTab === "tools" && (
          <div className="space-y-6 animate-in fade-in duration-300" role="tabpanel" id="panel-tools">
            <div className="space-y-1" id="tools-panel-header">
              <h2 className="text-xl font-bold text-slate-800 tracking-tight font-display">Active Stress Reliever Box</h2>
              <p className="text-slate-605 text-xs font-semibold">Engage AI cognitive diagnostic utilities and box breathing exercises to restore full studying potential</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start" id="tools-panel-grid">
              {/* Left Col: Breathing + Suggester */}
              <div className="space-y-6">
                <BreathingExercise />
                <BalanceSuggestionsCard />
              </div>

              {/* Right Col: Motivation + Stress diagnostic */}
              <div className="space-y-6">
                <MotivationCard
                  currentMood={mood}
                  stressLevel={stressLevel}
                  currentReflection={reflection}
                />
                <TriggerAnalysisCard />
              </div>
            </div>
          </div>
        )}

      </main>

      {/* Global Status Footer */}
      <footer className="h-12 px-6 flex items-center justify-between bg-white/20 backdrop-blur-md border-t border-white/20 text-[10px] font-black text-slate-700 uppercase tracking-wider mt-auto shrink-0 select-none shadow-sm" id="status-footer-details">
        <div>Current Streak: {entries.length > 0 ? entries.length + 3 : 4} Days 🔥</div>
        <div className="flex gap-6">
          <span className="hidden sm:inline">Support Helpline: 1800-599-0019</span>
          <span className="text-indigo-700 hover:underline cursor-pointer">Confidential Help Guidance</span>
        </div>
      </footer>

      {/* 3. Mobile Navigation Tab bar (Only visible on smaller screens for mobile-first comfort) */}
      <footer className="sm:hidden fixed bottom-0 left-0 right-0 bg-white/30 backdrop-blur-md border-t border-white/20 px-4 py-2 shadow-2xl z-40" id="mobile-navigation-bar" role="tablist">
        <div className="grid grid-cols-4 gap-1 text-center" id="mobile-nav-grid">
          {[
            { id: "dashboard", label: "Dashboard", icon: <Layers className="h-5 w-5" /> },
            { id: "history", label: "History", icon: <TrendingUp className="h-5 w-5" /> },
            { id: "coach", label: "AI Coach", icon: <MessageCircle className="h-5 w-5" /> },
            { id: "tools", label: "Relief Tools", icon: <Activity className="h-5 w-5" /> },
          ].map((tab) => {
            const isSelected = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                id={`mobile-tab-btn-${tab.id}`}
                role="tab"
                aria-selected={isSelected}
                aria-controls={`panel-${tab.id}`}
                onClick={() => handleTabSelect(tab.id)}
                className={`flex flex-col items-center justify-center p-1.5 rounded-2xl transition-all cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-indigo-650 ${
                  isSelected
                    ? "text-indigo-805 bg-white/70 font-black shadow-xs"
                    : "text-slate-600 hover:text-slate-800 font-bold"
                }`}
              >
                <div className={`${isSelected ? "scale-105" : "text-slate-500"}`}>{tab.icon}</div>
                <span className="text-[10px] mt-1 tracking-tight leading-none">{tab.label}</span>
              </button>
            );
          })}
        </div>
      </footer>
    </div>
  );
}

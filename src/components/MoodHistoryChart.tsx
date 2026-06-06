import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from "recharts";
import { Smile, TrendingUp, AlertCircle, Sparkles } from "lucide-react";
import { MoodEntry } from "../types";

interface MoodHistoryChartProps {
  entries: MoodEntry[];
}

export default function MoodHistoryChart({ entries }: MoodHistoryChartProps) {
  if (entries.length === 0) {
    return (
      <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm text-center space-y-4" id="empty-history-chart">
        <div className="mx-auto w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center">
          <Smile className="h-6 w-6 text-indigo-500" />
        </div>
        <div className="space-y-1">
          <h3 className="text-base font-bold text-slate-800">No Check-in Data Yet</h3>
          <p className="text-slate-500 text-xs max-w-sm mx-auto leading-relaxed">
            Record your mood, stress level, and some today reflections in the Dashboard to generate trends and stress tracking charts!
          </p>
        </div>
      </div>
    );
  }

  // Map mood strings to a numerical score for chart plotting
  const getMoodValue = (moodStr: string) => {
    if (moodStr.includes("Great")) return 5;
    if (moodStr.includes("Good")) return 4;
    if (moodStr.includes("Okay")) return 3;
    if (moodStr.includes("Stressed")) return 2;
    if (moodStr.includes("Overwhelmed")) return 1;
    return 3; // default Okay
  };

  const getMoodLabel = (val: number) => {
    switch (val) {
      case 5: return "😀 Great";
      case 4: return "🙂 Good";
      case 3: return "😐 Okay";
      case 2: return "😔 Stressed";
      case 1: return "😭 Overwhelmed";
      default: return "";
    }
  };

  // Chronologically sort entries and take at most the last 7 entries for weekly comparison
  const sortedEntries = [...entries]
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(-7);

  const chartData = sortedEntries.map((entry) => {
    const d = new Date(entry.date);
    const dateFormatted = d.toLocaleDateString(undefined, { month: "short", day: "numeric" });
    return {
      date: dateFormatted,
      mood: getMoodValue(entry.mood),
      stress: entry.stressLevel,
      score: entry.wellnessScore,
    };
  });

  return (
    <div className="space-y-8" id="mood-history-charts-collection">
      {/* 1. Integrated Mood & Wellness Score Trend */}
      <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm space-y-4" id="chart-mood-container">
        <div className="flex items-center justify-between" id="chart-mood-header">
          <div className="space-y-1">
            <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-emerald-500" />
              <span>Mood & Wellness Trend (Last 7 Logs)</span>
            </h3>
            <p className="text-slate-400 text-xs">Comparing your emotional state over time (higher is better)</p>
          </div>
          <div className="flex items-center gap-4 text-xs font-semibold">
            <div className="flex items-center gap-1.5 text-emerald-500">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block"></span>
              <span>Wellness Score (0-100)</span>
            </div>
            <div className="flex items-center gap-1.5 text-indigo-500">
              <span className="w-2.5 h-2.5 rounded-full bg-indigo-500 inline-block"></span>
              <span>Mood Level (1-5)</span>
            </div>
          </div>
        </div>

        <div className="h-64 sm:h-72 w-full pt-4" id="recharts-mood-wrapper">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="date" stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} />
              <YAxis yAxisId="left" stroke="#10b981" domain={[0, 100]} fontSize={11} tickLine={false} axisLine={false} />
              <YAxis yAxisId="right" stroke="#6366f1" orientation="right" domain={[1, 5]} ticks={[1, 2, 3, 4, 5]} fontSize={11} tickLine={false} axisLine={false} tickFormatter={(val) => getMoodLabel(val).split(" ")[0]} />
              <Tooltip
                contentStyle={{ background: "#ffffff", borderRadius: "16px", border: "1px solid #f1f5f9", boxShadow: "0 4px 12px rgba(0,0,0,0.05)" }}
                labelStyle={{ fontWeight: "700", color: "#1e293b", fontSize: "12px", marginBottom: "4px" }}
                formatter={(value: any, name: string) => {
                  if (name === "mood") {
                    return [getMoodLabel(Number(value)), "Mood"];
                  }
                  return [value, "Wellness Score"];
                }}
              />
              <Line yAxisId="left" type="monotone" dataKey="score" stroke="#10b981" strokeWidth={3} dot={{ fill: "#10b981", r: 4 }} activeDot={{ r: 6 }} />
              <Line yAxisId="right" type="monotone" dataKey="mood" stroke="#6366f1" strokeWidth={3} dot={{ fill: "#6366f1", r: 4 }} activeDot={{ r: 6 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 2. Stress Level Weekly Pattern */}
      <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm space-y-4" id="chart-stress-container">
        <div className="flex items-center justify-between" id="chart-stress-header">
          <div className="space-y-1">
            <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-rose-500" />
              <span>Stress Level Matrix (1-10)</span>
            </h3>
            <p className="text-slate-400 text-xs">Identifies potential peak performance states vs exhaustion thresholds</p>
          </div>
          <div className="flex items-center gap-1.5 text-xs font-semibold text-rose-500">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500 inline-block animate-pulse"></span>
            <span>Stress Meter</span>
          </div>
        </div>

        <div className="h-64 sm:h-72 w-full pt-4" id="recharts-stress-wrapper">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="date" stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} />
              <YAxis stroke="#f43f5e" domain={[1, 10]} ticks={[1, 3, 5, 7, 9, 10]} fontSize={11} tickLine={false} axisLine={false} />
              <Tooltip
                contentStyle={{ background: "#ffffff", borderRadius: "16px", border: "1px solid #f1f5f9", boxShadow: "0 4px 12px rgba(0,0,0,0.05)" }}
                labelStyle={{ fontWeight: "700", color: "#1e293b", fontSize: "12px" }}
              />
              <ReferenceLine y={5} stroke="#f59e0b" strokeDasharray="3 3" label={{ value: "Optimal Threshold", fill: "#f59e0b", fontSize: 10, position: "top" }} />
              <ReferenceLine y={8} stroke="#ef4444" strokeDasharray="3 3" label={{ value: "Burnout Alert", fill: "#ef4444", fontSize: 10, position: "top" }} />
              <Line type="monotone" dataKey="stress" stroke="#f43f5e" strokeWidth={3} dot={{ fill: "#f43f5e", r: 4 }} activeDot={{ r: 6 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

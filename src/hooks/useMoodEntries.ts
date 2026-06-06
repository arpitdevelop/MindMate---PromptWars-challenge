import { useCallback, useMemo } from "react";
import { MoodEntry } from "../types";
import { useLocalStorage } from "./useLocalStorage";
import { calculateWellnessScore, getWellnessGrade } from "../utils/wellness";

export function useMoodEntries() {
  const [entries, setEntries] = useLocalStorage<MoodEntry[]>("mindmate_mood_entries", []);

  // Calculate statistics - fully memoized to prevent expensive calculations on simple re-renders
  const stats = useMemo(() => {
    const total = entries.length;
    const totalScore = entries.reduce((acc, entry) => acc + entry.wellnessScore, 0);
    const average = total > 0 ? Math.round(totalScore / total) : 0;
    const grade = getWellnessGrade(average);

    return {
      total,
      average,
      grade,
      hasData: total > 0,
    };
  }, [entries]);

  // Saves a new entry
  const saveEntry = useCallback((mood: string, stressLevel: number, reflection: string): MoodEntry => {
    const todayStr = new Date().toISOString().split("T")[0];
    const score = calculateWellnessScore(mood, stressLevel);

    const newEntry: MoodEntry = {
      id: `entry-${Date.now()}`,
      date: todayStr,
      mood,
      stressLevel,
      reflection: reflection.trim(),
      wellnessScore: score,
    };

    setEntries((prev) => [newEntry, ...prev]);
    return newEntry;
  }, [setEntries]);

  // Deletes a past log entry
  const deleteEntry = useCallback((id: string) => {
    setEntries((prev) => prev.filter((item) => item.id !== id));
  }, [setEntries]);

  // Generates a simple AI text analysis briefing context directly from historical trends 
  // to power the "additional hackathon enhancements" (Analytics Summary).
  const historicalInsightSummary = useMemo(() => {
    if (entries.length === 0) return "No entries recorded yet. Share your mood logs to populate stats.";
    
    const recentScores = entries.slice(0, 5).map(e => e.wellnessScore);
    const averageStress = entries.reduce((acc, e) => acc + e.stressLevel, 0) / entries.length;
    const isWorsening = recentScores.length > 1 && recentScores[0] < recentScores[recentScores.length - 1];
    
    let summaryText = `Over your last ${entries.length} tracked checks, your average stress levels hovered around ${averageStress.toFixed(1)}/10. `;
    if (isWorsening) {
      summaryText += "Your recent logs denote a mild increase in prep tension. Consider scheduling larger visual breaks.";
    } else {
      summaryText += "Your overall emotional wellness trends remain balanced. Keep up great pacing!";
    }
    return summaryText;
  }, [entries]);

  return {
    entries,
    stats,
    saveEntry,
    deleteEntry,
    historicalInsightSummary,
  };
}

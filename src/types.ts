export interface MoodEntry {
  id: string; // unique ID
  date: string; // ISO string format (e.g. YYYY-MM-DD)
  mood: string; // '😀 Great' | '🙂 Good' | '😐 Okay' | '😔 Stressed' | '😭 Overwhelmed'
  stressLevel: number; // 1-10
  reflection: string; // Today's reflection text
  wellnessScore: number; // 0-100
}

export interface ChatMessage {
  id: string;
  role: "user" | "ai";
  text: string;
  timestamp: string; // ISO string or short time
}

export interface StressTriggerAnalysis {
  primaryTriggers: string[];
  suggestions: string[];
  encouragement: string;
}

export interface DailyMotivation {
  motivation: string;
  studyTip: string;
  wellnessTip: string;
}

export interface StudyLifeBalance {
  feedback: string;
  sleepSuggestions: string;
  breakRecommendations: string;
}

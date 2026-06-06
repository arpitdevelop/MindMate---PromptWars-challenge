import { useState, memo, useCallback } from "react";
import { BookOpen, RefreshCw, PenTool, AlertCircle } from "lucide-react";
import { validateReflectionText } from "../utils/wellness";

interface ReflectionCardProps {
  value: string;
  onChange: (value: string) => void;
}

const REFLECTION_PROMPTS = [
  "What went well in your study session today?",
  "What is bothering you or causing exam anxiety right now?",
  "What is one thing you are worried about, and what's the worst-case vs realistic outcome?",
  "Describe one topic you understood beautifully today.",
  "How did you feel about your focus, and how can you make tomorrow a tiny bit better?",
  "Write down one person, activity, or reminder you're grateful for today."
];

function ReflectionCard({ value, onChange }: ReflectionCardProps) {
  const [promptIndex, setPromptIndex] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const rotatePrompt = useCallback(() => {
    setPromptIndex((prev) => (prev + 1) % REFLECTION_PROMPTS.length);
  }, []);

  const applyPromptToText = useCallback(() => {
    const prompt = REFLECTION_PROMPTS[promptIndex];
    if (!value) {
      onChange(`[Reflection Prompt: ${prompt}]\n- `);
    } else {
      onChange(`${value}\n\n[Prompt: ${prompt}]\n- `);
    }
    setError(null);
  }, [promptIndex, value, onChange]);

  const handleTextChange = (text: string) => {
    const validation = validateReflectionText(text);
    if (!validation.valid) {
      setError(validation.error);
    } else {
      setError(null);
    }
    onChange(validation.cleanText);
  };

  return (
    <div className="bg-white/60 backdrop-blur-xl border border-white/40 shadow-xl rounded-[2rem] p-6 space-y-4 focus-within:ring-2 focus-within:ring-indigo-500/50" id="reflection-card-container">
      <div className="flex flex-wrap items-center justify-between gap-2" id="reflection-card-header">
        <div className="flex items-center gap-2 text-slate-800 font-bold text-lg">
          <BookOpen className="h-5 w-5 text-indigo-500" aria-hidden="true" />
          <span>Today's Reflection</span>
        </div>
        <button
          type="button"
          onClick={rotatePrompt}
          aria-label="Change current helpful reflection prompt inspiration"
          className="flex items-center gap-1.5 text-xs text-indigo-700 hover:text-indigo-800 bg-white/50 border border-white/60 hover:bg-white/85 px-3 py-1 rounded-full transition-all cursor-pointer shadow-xs focus-visible:ring-2 focus-visible:ring-indigo-500 outline-none"
          id="rotate-prompt-btn"
        >
          <RefreshCw className="h-3.5 w-3.5" aria-hidden="true" />
          <span>Change Prompt</span>
        </button>
      </div>

      <div className="bg-white/45 backdrop-blur-md border border-white/50 rounded-2xl p-4 relative overflow-hidden shadow-xs" id="reflection-prompt-bubble">
        <div className="absolute top-0 left-0 w-1 h-full bg-indigo-500" aria-hidden="true"></div>
        <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest block mb-1">Inspiration Prompt</span>
        <p className="text-sm text-slate-800 italic pr-6 leading-relaxed font-sans font-medium">"{REFLECTION_PROMPTS[promptIndex]}"</p>
        <button
          type="button"
          onClick={applyPromptToText}
          aria-label="Paste current inspiration prompt directly into your thoughts text space"
          className="mt-2.5 text-xs font-bold text-indigo-700 border border-white/70 bg-white/80 hover:bg-white px-3.5 py-1 rounded-xl transition-all cursor-pointer shadow-xs focus-visible:ring-2 focus-visible:ring-indigo-500 outline-none"
          id="use-prompt-btn"
        >
          Use this prompt
        </button>
      </div>

      <div className="relative" id="reflection-text-wrapper">
        <textarea
          id="reflection-textarea"
          rows={4}
          value={value}
          maxLength={2000}
          aria-label="Write down your today student reflection thoughts"
          onChange={(e) => handleTextChange(e.target.value)}
          placeholder="Write your raw thoughts... What's bothering you? What are you worried about? Don't censor yourself. Writing it down helps release stress from your working memory."
          className="w-full text-slate-800 placeholder-slate-600 border border-white/50 bg-white/45 focus:bg-white/80 focus:ring-2 focus:ring-indigo-300 rounded-2xl p-4 text-sm leading-relaxed outline-none transition-all duration-300 resize-none font-sans font-bold shadow-2xs"
        />
        <div className="absolute bottom-3 right-3 flex items-center gap-1 text-[11px] text-slate-605 font-mono select-none font-bold">
          <PenTool className="h-3 w-3" aria-hidden="true" />
          <span>{value.length} / 2000 chars</span>
        </div>
      </div>

      {error && (
        <div className="flex items-center gap-2 p-3 rounded-2xl border border-rose-100 bg-rose-50 text-rose-700 text-xs" role="alert">
          <AlertCircle className="h-4 w-4 shrink-0" aria-hidden="true" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
}

export default memo(ReflectionCard);

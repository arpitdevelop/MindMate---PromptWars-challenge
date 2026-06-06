import { useState } from "react";
import { BookOpen, RefreshCw, PenTool } from "lucide-react";

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

export default function ReflectionCard({ value, onChange }: ReflectionCardProps) {
  const [promptIndex, setPromptIndex] = useState(0);

  const rotatePrompt = () => {
    setPromptIndex((prev) => (prev + 1) % REFLECTION_PROMPTS.length);
  };

  const applyPromptToText = () => {
    const prompt = REFLECTION_PROMPTS[promptIndex];
    if (!value) {
      onChange(`[Reflection Prompt: ${prompt}]\n- `);
    } else {
      onChange(`${value}\n\n[Prompt: ${prompt}]\n- `);
    }
  };

  return (
    <div className="bg-white/60 backdrop-blur-xl border border-white/40 shadow-xl rounded-[2rem] p-6 space-y-4" id="reflection-card-container">
      <div className="flex flex-wrap items-center justify-between gap-2" id="reflection-card-header">
        <div className="flex items-center gap-2 text-slate-800 font-bold text-lg">
          <BookOpen className="h-5 w-5 text-indigo-500" />
          <span>Today's Reflection</span>
        </div>
        <button
          type="button"
          onClick={rotatePrompt}
          className="flex items-center gap-1.5 text-xs text-indigo-700 hover:text-indigo-800 bg-white/50 border border-white/60 hover:bg-white/85 px-3 py-1 rounded-full transition-all cursor-pointer shadow-xs"
          id="rotate-prompt-btn"
        >
          <RefreshCw className="h-3.5 w-3.5" />
          <span>Change Prompt</span>
        </button>
      </div>

      <div className="bg-white/40 backdrop-blur-md border border-white/50 rounded-2xl p-4 relative overflow-hidden shadow-xs" id="reflection-prompt-bubble">
        <div className="absolute top-0 left-0 w-1 h-full bg-indigo-500"></div>
        <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider block mb-1">Inspirations</span>
        <p className="text-sm text-slate-700 italic pr-6 leading-relaxed font-sans">{REFLECTION_PROMPTS[promptIndex]}</p>
        <button
          type="button"
          onClick={applyPromptToText}
          className="mt-2.5 text-xs font-bold text-indigo-700 border border-white/70 bg-white/80 hover:bg-white px-3.5 py-1 rounded-xl transition-all cursor-pointer shadow-xs"
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
          onChange={(e) => onChange(e.target.value)}
          placeholder="Write your raw thoughts... What's bothering you? What are you worried about? Don't censor yourself. Writing it down helps release stress from your working memory."
          className="w-full text-slate-700 placeholder-slate-500 border border-white/50 bg-white/45 focus:bg-white/80 focus:ring-2 focus:ring-indigo-300 rounded-2xl p-4 text-sm leading-relaxed outline-none transition-all duration-300 resize-none font-sans"
        />
        <div className="absolute bottom-3 right-3 flex items-center gap-1 text-[11px] text-slate-500 font-mono">
          <PenTool className="h-3 w-3" />
          <span>{value.length} chars</span>
        </div>
      </div>
    </div>
  );
}

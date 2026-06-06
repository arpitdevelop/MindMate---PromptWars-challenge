import { useState, useRef, useEffect, useCallback, memo } from "react";
import { MessageCircle, Send, Sparkles, AlertCircle, Loader2, RefreshCw, Heart } from "lucide-react";
import { ChatMessage } from "../types";
import { generateCoachResponse } from "../lib/gemini";
import { validateChatMessage } from "../utils/wellness";
import { useOnlineStatus } from "../hooks/useOnlineStatus";
import SupportModal from "./SupportModal";

const CHAT_QUESTION_STARTERS = [
  "I am scared about my upcoming exam.",
  "I feel like I am not studying enough.",
  "I got a low mock test score.",
  "I am extremely anxious about results."
];

// Helper to check emergency matches
function checkForEmergency(text: string): boolean {
  const phrases = [
    "i want to give up",
    "i hate my life",
    "i want to disappear",
    "nobody cares",
    "kill myself",
    "suicide",
    "disappear"
  ];
  return phrases.some((phrase) => text.toLowerCase().includes(phrase));
}

export default function AIChat() {
  const isOnline = useOnlineStatus();

  // Load configuration from LocalStorage
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    const saved = localStorage.getItem("mindmate_chat_history");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error("Failed to parse chat log:", e);
      }
    }
    // Default welcome messages
    return [
      {
        id: "welcome-1",
        role: "ai",
        text: `Hello there! I'm your MindMate Student Wellness Coach. 🌸 \n\nWhether you're struggling to concentrate on JEE/NEET/UPSC prep, felt discouraged by a mock score, or are feeling anxious about results, I am here. \n\nYou can talk to me about anything that's weighing you down. How are you feeling today?`,
        timestamp: new Date().toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" }),
      },
    ];
  });

  const [inputMessage, setInputMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Emergency safety system
  const [supportModalOpen, setSupportModalOpen] = useState(false);
  const [interceptedMessage, setInterceptedMessage] = useState<string | null>(null);

  const endOfChatRef = useRef<HTMLDivElement | null>(null);

  // Persist messages to Local Storage
  useEffect(() => {
    localStorage.setItem("mindmate_chat_history", JSON.stringify(messages));
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    if (endOfChatRef.current) {
      endOfChatRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  // Main message sender
  const handleSendMessage = useCallback(async (msgText: string) => {
    // Basic verification and anti-spam locks
    if (loading) return; 
    
    const validationResult = validateChatMessage(msgText);
    if (!validationResult.valid && !checkForEmergency(msgText)) {
      setError(validationResult.error);
      return;
    }

    const cleanText = validationResult.cleanText || msgText.trim();

    // Intercept emergency phrases before sending
    if (checkForEmergency(cleanText)) {
      setInterceptedMessage(cleanText);
      setSupportModalOpen(true);
      return;
    }

    if (!isOnline) {
      setError("You appear to be offline. Please verify your internet connection before consulting the AI Coach.");
      return;
    }

    // Append user message
    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: "user",
      text: cleanText,
      timestamp: new Date().toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputMessage("");
    setLoading(true);
    setError(null);

    try {
      // Build history payload
      // Slices and transforms message payload
      const apiHistory = messages
        .filter((m) => m.id !== "welcome-1")
        .map((m) => ({
          role: m.role,
          text: m.text,
        }));

      const coachReplyText = await generateCoachResponse(apiHistory, cleanText);

      const aiMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        role: "ai",
        text: coachReplyText,
        timestamp: new Date().toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" }),
      };

      setMessages((prev) => [...prev, aiMsg]);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [messages, loading, isOnline]);

  // Handle emergency continue triggers
  const handleContinueAfterEmergencyModal = () => {
    setSupportModalOpen(false);
    if (interceptedMessage) {
      const msg = interceptedMessage;
      setInterceptedMessage(null);
      handleSendMessage(msg);
    }
  };

  const handleCloseEmergencyModal = () => {
    setSupportModalOpen(false);
    setInterceptedMessage(null);
    setInputMessage("");
  };

  const clearChatHistory = () => {
    if (window.confirm("Are you sure you want to clear your chat history with the Wellness Coach?")) {
      const defaultMsg: ChatMessage[] = [
        {
          id: "welcome-1",
          role: "ai",
          text: `Hello there! I'm your MindMate Student Wellness Coach. 🌸 \n\nWhether you're struggling to concentrate on JEE/NEET/UPSC prep, felt discouraged by a mock score, or are feeling anxious about results, I am here. Let's talk.`,
          timestamp: new Date().toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" }),
        },
      ];
      setMessages(defaultMsg);
      localStorage.setItem("mindmate_chat_history", JSON.stringify(defaultMsg));
    }
  };

  return (
    <div className="bg-white/60 backdrop-blur-xl border border-white/40 shadow-xl rounded-[2rem] flex flex-col h-[600px] overflow-hidden focus-visible:ring-2 focus-visible:ring-indigo-500/50" id="chat-card-container">
      {/* Network offline guard banner */}
      {!isOnline && (
        <div className="bg-amber-500 text-white px-4 py-2 text-xs font-black flex items-center justify-center gap-2" id="chat-offline-banner">
          <AlertCircle className="h-3.5 w-3.5" />
          <span>Offline mode active. Chat functions are temporarily suspended until connection returns.</span>
        </div>
      )}

      {/* Chat header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-white/20 bg-white/25" id="chat-card-header">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 bg-white/50 rounded-2xl flex items-center justify-center border border-white/60 shadow-xs">
            <Sparkles className="h-4 w-4 text-indigo-700 fill-indigo-100 animate-pulse" aria-hidden="true" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-800">MindMate AI Coach</h4>
            <span className="text-[10px] text-emerald-700 font-extrabold flex items-center gap-1" aria-live="polite">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block animate-pulse"></span>
              {isOnline ? "Active Companion" : "Offline"}
            </span>
          </div>
        </div>
        <button
          type="button"
          onClick={clearChatHistory}
          aria-label="Clear chat messages logs list"
          className="text-[11px] text-slate-600 hover:text-rose-600 font-bold tracking-tight flex items-center gap-1 transition-all cursor-pointer bg-white/40 hover:bg-white/80 px-2.5 py-1.5 rounded-xl border border-white/50 shadow-xs focus-visible:ring-2 focus-visible:ring-indigo-500/50 outline-none"
          id="clear-chat-history-btn"
        >
          <RefreshCw className="h-3 w-3" aria-hidden="true" />
          <span>Clear Chat</span>
        </button>
      </div>

      {/* Message Stream */}
      <div 
        className="flex-1 overflow-y-auto p-5 space-y-4 bg-transparent" 
        id="chat-messages-container"
        aria-live="polite"
      >
        {messages.map((msg) => {
          const isAI = msg.role === "ai";
          return (
            <div
              key={msg.id}
              className={`flex items-end gap-2 max-w-[85%] ${isAI ? "self-start" : "self-end ml-auto flex-row-reverse"}`}
              id={`chat-msg-row-${msg.id}`}
            >
              <div
                id={`chat-msg-bubble-${msg.id}`}
                className={`p-4 rounded-3xl text-xs leading-relaxed font-sans shadow-xs border ${
                  isAI
                    ? "bg-white/85 backdrop-blur-md border-white/60 text-slate-850 rounded-bl-none rounded-br-2xl font-semibold"
                    : "bg-slate-800 border-slate-700 text-white rounded-br-none rounded-bl-2xl font-bold font-sans"
                }`}
                style={{ whiteSpace: "pre-wrap" }}
              >
                {msg.text}
                <span
                  className={`block text-[9px] mt-2 text-right ${isAI ? "text-slate-500" : "text-slate-300"}`}
                  id={`chat-msg-time-${msg.id}`}
                >
                  {msg.timestamp}
                </span>
              </div>
            </div>
          );
        })}
        
        {/* Dynamic Skeleton Loader for typing indicator */}
        {loading && (
          <div className="flex items-end gap-2 max-w-[85%] self-start" id="chat-spinner-row" aria-live="polite">
            <div className="p-4 rounded-3xl border border-white/50 bg-white/70 backdrop-blur-md shadow-xs rounded-bl-none text-slate-700 flex items-center gap-3">
              <div className="flex space-x-1 items-center" aria-hidden="true">
                <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce"></span>
                <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce delay-75"></span>
                <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce delay-150"></span>
              </div>
              <span className="text-xs italic font-extrabold text-indigo-700">Coach drafting reassurance...</span>
            </div>
          </div>
        )}

        {error && (
          <div className="flex items-start gap-2 p-3 rounded-2xl border border-rose-100 bg-rose-50 text-rose-700 text-xs max-w-[85%]" id="chat-error-row" role="alert">
            <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" aria-hidden="true" />
            <span>{error}</span>
          </div>
        )}
        <div ref={endOfChatRef} id="chat-end-of-stream-anchor" />
      </div>

      {/* Suggested Chat prompts */}
      {messages.length <= 1 && (
        <div className="px-5 py-3.5 bg-white/20 backdrop-blur-md border-t border-white/25" id="suggested-queries-box">
          <p className="text-[10px] uppercase font-bold tracking-widest text-slate-700 mb-2 flex items-center gap-1 leading-none">
            <Heart className="h-3.5 w-3.5 text-indigo-500 fill-indigo-100" aria-hidden="true" />
            <span>Quick topics to start:</span>
          </p>
          <div className="flex flex-wrap gap-2" id="suggested-queries-flex">
            {CHAT_QUESTION_STARTERS.map((starter) => (
              <button
                key={starter}
                type="button"
                onClick={() => {
                  setInputMessage(starter);
                  handleSendMessage(starter);
                }}
                className="text-[11px] text-slate-750 hover:text-slate-900 bg-white/50 hover:bg-white/85 border border-white/60 font-semibold px-3 py-2 rounded-xl transition-all cursor-pointer shadow-xs text-left leading-normal outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/50"
              >
                {starter}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Chat Form panel */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSendMessage(inputMessage);
        }}
        className="p-4 border-t border-white/20 bg-white/20 backdrop-blur-md flex gap-2 items-center text-left"
        id="chat-form-container"
      >
        <input
          id="chat-text-input"
          type="text"
          placeholder="Message MindMate Student Wellness Coach..."
          value={inputMessage}
          disabled={loading || !isOnline}
          aria-label="Type message text for student wellness coach"
          maxLength={500}
          onChange={(e) => {
            setInputMessage(e.target.value);
            if (error) setError(null);
          }}
          className="flex-1 bg-white/45 text-xs text-slate-850 placeholder-slate-600 rounded-2xl px-4 py-3 border border-white/50 outline-none focus:bg-white/80 focus:ring-2 focus:ring-indigo-400 transition-all font-semibold disabled:cursor-not-allowed"
        />
        <button
          id="chat-submit-btn"
          type="submit"
          aria-label="Send text to wellness coach"
          disabled={!inputMessage.trim() || loading || !isOnline}
          className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-white/30 disabled:text-slate-400 text-white font-bold rounded-2xl p-3 shrink-0 flex items-center justify-center transition-colors cursor-pointer shadow-md focus-visible:ring-2 focus-visible:ring-indigo-600 outline-none"
        >
          <Send className="h-4 w-4" aria-hidden="true" />
        </button>
      </form>

      {/* Integrated Emergency Support Trigger Modal */}
      <SupportModal
        isOpen={supportModalOpen}
        onClose={handleCloseEmergencyModal}
        onContinueToAI={handleContinueAfterEmergencyModal}
      />
    </div>
  );
}

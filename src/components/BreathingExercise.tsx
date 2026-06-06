import { useState, useEffect } from "react";
import { Wind, Play, Pause, RotateCcw, ShieldCheck } from "lucide-react";

type BreathPhase = "Inhale" | "Hold" | "Exhale";

export default function BreathingExercise() {
  const [isActive, setIsActive] = useState(false);
  const [phase, setPhase] = useState<BreathPhase>("Inhale");
  const [seconds, setSeconds] = useState(4);
  const [completedCycles, setCompletedCycles] = useState(0);

  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;

    if (isActive) {
      timer = setInterval(() => {
        setSeconds((prev) => {
          if (prev <= 1) {
            // Transition phases
            if (phase === "Inhale") {
              setPhase("Hold");
              return 4;
            } else if (phase === "Hold") {
              setPhase("Exhale");
              return 4;
            } else {
              setPhase("Inhale");
              setCompletedCycles((c) => c + 1);
              return 4;
            }
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (timer) clearInterval(timer);
    }

    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isActive, phase]);

  const resetExercise = () => {
    setIsActive(false);
    setPhase("Inhale");
    setSeconds(4);
    setCompletedCycles(0);
  };

  // Define visual states for the breathing bubble
  const getBubbleStyle = () => {
    if (!isActive) return "scale-100 bg-indigo-100/80 border-indigo-200";
    if (phase === "Inhale") {
      // Circle grows larger
      return "scale-[1.3] bg-emerald-100/90 border-emerald-300 shadow-lg shadow-emerald-100/50";
    }
    if (phase === "Hold") {
      // Circle holds size with active pulse
      return "scale-[1.3] bg-amber-100/95 border-amber-300 shadow-lg shadow-amber-300/40 animate-pulse";
    }
    // Phase Exhale: Circle returns to original scale
    return "scale-95 bg-indigo-50 border-indigo-200/80";
  };

  const getPhaseColor = () => {
    if (phase === "Inhale") return "text-emerald-600";
    if (phase === "Hold") return "text-amber-600";
    return "text-indigo-600";
  };

  const getPhaseInstruction = () => {
    if (phase === "Inhale") return "Breathe in deeply through your nose. Fill your lungs.";
    if (phase === "Hold") return "Hold your breath. Keep your mind completely still.";
    return "Exhale slowly through your mouth. Release all tension.";
  };

  return (
    <div className="bg-white/60 backdrop-blur-xl border border-white/40 shadow-xl rounded-[2rem] p-6 space-y-6 flex flex-col items-center text-center" id="breathing-card">
      <div className="flex items-center gap-2 justify-center w-full pb-2 border-b border-white/20" id="breathing-header">
        <Wind className="h-5 w-5 text-indigo-600" />
        <h3 className="text-base font-bold text-slate-800">Mindful Box Breathing (4-4-4)</h3>
      </div>

      {/* Interactive Visual Box Breathing Area */}
      <div className="relative h-56 w-full flex items-center justify-center" id="breathing-bubble-wrapper">
        <div
          id="breathing-outer-ring"
          className="absolute h-40 w-40 rounded-full border border-white/30 pointer-events-none"
        />
        <div
          id="breathing-bubble"
          className={`h-28 w-28 rounded-full border flex flex-col items-center justify-center transition-all duration-[4000ms] ease-in-out select-none backdrop-blur-md shadow-inner ${getBubbleStyle()}`}
        >
          {isActive ? (
            <div className="flex flex-col items-center">
              <span className={`text-xs font-bold uppercase tracking-widest leading-none ${getPhaseColor()}`}>
                {phase}
              </span>
              <span className="text-3xl font-black mt-1 text-slate-800 tabular-nums">
                {seconds}s
              </span>
            </div>
          ) : (
            <div className="flex flex-col items-center select-none">
              <Wind className="h-7 w-7 text-indigo-500 animate-pulse" />
              <span className="text-xs font-bold text-indigo-600 mt-1 uppercase tracking-wider">Ready</span>
            </div>
          )}
        </div>
      </div>

      {/* Control Instruction Box */}
      <div className="space-y-1.5 min-h-[50px] px-4" id="breathing-instructions">
        <h4 className={`font-bold text-sm transition-all ${isActive ? getPhaseColor() : "text-slate-800"}`}>
          {isActive ? `${phase} State` : "Find a comfortable posture"}
        </h4>
        <p className="text-xs text-slate-600 leading-relaxed max-w-sm mx-auto">
          {isActive ? getPhaseInstruction() : "A simple 4-second pattern optimized by brain studies to reduce cognitive overload and mock-test panic."}
        </p>
      </div>

      {/* Counter metrics */}
      <div className="flex items-center justify-center gap-1.5 text-xs font-bold text-slate-600 bg-white/40 backdrop-blur-md px-3.5 py-1.5 rounded-2xl border border-white/40 shadow-xs" id="cycles-count">
        <ShieldCheck className="h-4 w-4 text-emerald-600" />
        <span>Completed Cycles: <strong className="text-slate-800 font-bold">{completedCycles}</strong></span>
      </div>

      {/* Start/Stop Button Layout */}
      <div className="flex items-center gap-3 w-full" id="breathing-controls">
        <button
          type="button"
          onClick={() => setIsActive(!isActive)}
          id="play-breathing-btn"
          className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl font-bold text-xs uppercase tracking-wider transition-all shadow-md cursor-pointer ${
            isActive
              ? "bg-slate-800 hover:bg-slate-700 text-white"
              : "bg-indigo-600 hover:bg-indigo-700 text-white"
          }`}
        >
          {isActive ? (
            <>
              <Pause className="h-4 w-4 fill-white" />
              <span>Pause</span>
            </>
          ) : (
            <>
              <Play className="h-4 w-4 fill-white" />
              <span>Start</span>
            </>
          )}
        </button>

        <button
          type="button"
          onClick={resetExercise}
          id="reset-breathing-btn"
          className="p-3 border border-white/40 bg-white/40 hover:bg-white/80 rounded-2xl text-slate-600 transition-all cursor-pointer shadow-xs"
          title="Reset"
        >
          <RotateCcw className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

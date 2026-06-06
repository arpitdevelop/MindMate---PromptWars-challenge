import { MessageCircle, Heart, Phone, Users, ShieldAlert, X } from "lucide-react";

interface SupportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onContinueToAI: () => void;
}

export default function SupportModal({ isOpen, onClose, onContinueToAI }: SupportModalProps) {
  if (!isOpen) return null;

  return (
    <div
      id="emergency-support-modal-overlay"
      className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 transition-all duration-300"
    >
      <div
        id="emergency-support-modal-box"
        className="bg-white rounded-3xl max-w-md w-full p-6 border border-rose-50 shadow-2xl relative space-y-6 animate-in fade-in zoom-in-95 duration-200"
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 hover:bg-slate-50 rounded-full text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
          aria-label="Close Modal"
        >
          <X className="h-4 w-4" />
        </button>

        {/* Header Alert Tag */}
        <div className="flex flex-col items-center text-center space-y-3" id="support-modal-header">
          <div className="p-3 bg-rose-50 border border-rose-100 rounded-2xl flex items-center justify-center">
            <Heart className="h-6 w-6 text-rose-500 fill-rose-500 animate-pulse" />
          </div>
          <div className="space-y-1">
            <h3 className="text-lg font-bold text-slate-800 tracking-tight">
              You seem to be going through a difficult time.
            </h3>
            <p className="text-slate-500 text-xs px-2 leading-relaxed">
              Preparation stress and expectation loads can feel crushing, but please remember that your life, presence, and happiness are worth far more than any score.
            </p>
          </div>
        </div>

        {/* Actionable Reassurance & Contact suggestions */}
        <div className="space-y-3" id="support-modal-resources">
          {/* Resource 1: Trust */}
          <div className="flex items-start gap-3 p-3.5 rounded-2xl border border-indigo-100 bg-indigo-50/20">
            <Users className="h-5 w-5 text-indigo-500 shrink-0 mt-0.5" />
            <div className="space-y-0.5">
              <h4 className="text-xs font-bold text-slate-800">Reach out to loved ones</h4>
              <p className="text-[11px] text-slate-600 leading-relaxed">
                Talk to a trusted friend or reach out to close family. Sharing even a fraction of what you feel removes massive weight.
              </p>
            </div>
          </div>

          {/* Resource 2: Professional Helpline */}
          <div className="flex items-start gap-3 p-3.5 rounded-2xl border border-rose-100 bg-rose-50/20">
            <Phone className="h-5 w-5 text-rose-500 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <h4 className="text-xs font-bold text-slate-800">Student Helpline Resources</h4>
              <p className="text-[11px] text-slate-600 leading-relaxed">
                Professional minds are available 24/7. Safe, completely confidential, and free:
              </p>
              <div className="text-[11px] font-mono font-bold text-slate-700 bg-white/70 px-2 py-1 rounded border border-slate-100 mt-1">
                📞 Kiran Helpline: 1800-599-0019 <br />
                📞 AASRA Support: +91-9820466726 
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex flex-col gap-2 pt-2" id="support-modal-actions">
          <button
            type="button"
            onClick={onClose}
            className="w-full bg-rose-600 hover:bg-rose-700 text-white font-semibold text-sm py-3 rounded-2xl shadow-sm transition-colors cursor-pointer"
          >
            I will talk to family / contact helpline
          </button>
          
          <button
            type="button"
            onClick={onContinueToAI}
            className="w-full text-slate-500 hover:text-slate-800 font-medium text-xs py-2 transition-colors cursor-pointer text-center"
          >
            Continue and chat with MindMate Coach
          </button>
        </div>
      </div>
    </div>
  );
}

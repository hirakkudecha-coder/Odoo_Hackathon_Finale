import React from 'react';
import { ShieldAlert, Clock, LogOut, CheckCircle2 } from 'lucide-react';

export const InactivityWarningModal = ({
  isOpen,
  remainingSeconds,
  onStayLoggedIn,
  onLogout
}) => {
  if (!isOpen) return null;

  const minutes = Math.floor(remainingSeconds / 60);
  const seconds = remainingSeconds % 60;
  const formattedTime = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  return (
    <div 
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-labelledby="inactivity-title"
    >
      <div className="bg-[#141A17] border border-[#2D4A3E] rounded-2xl max-w-md w-full p-6 shadow-2xl text-[#FAF8F5] space-y-6 relative overflow-hidden">
        {/* Glow ambient accent */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-[#D4AF37]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <div>
            <h3 id="inactivity-title" className="text-xl font-serif text-[#FAF8F5] tracking-wide">
              Workstation Security Warning
            </h3>
            <p className="text-xs text-[#9EABA2] mt-1">
              Urban Furniture ERP — Active Session Protection
            </p>
          </div>
        </div>

        <div className="bg-[#1A231F] border border-[#2D4A3E]/60 rounded-xl p-4 text-center space-y-2">
          <p className="text-sm text-[#D1D9D4]">
            You have been inactive for over 13 minutes. To protect ledger and financial records, your session will automatically terminate in:
          </p>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#141A17] border border-amber-500/40 text-amber-300 font-mono text-2xl font-bold">
            <Clock className="w-5 h-5 text-amber-400 animate-pulse" />
            <span>{formattedTime}</span>
          </div>
        </div>

        <div className="flex items-center gap-3 pt-2">
          <button
            type="button"
            onClick={onLogout}
            className="flex-1 px-4 py-2.5 rounded-xl border border-red-500/30 bg-red-950/20 hover:bg-red-900/30 text-red-300 text-sm font-medium flex items-center justify-center gap-2 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Log Out Now</span>
          </button>
          <button
            type="button"
            onClick={onStayLoggedIn}
            className="flex-1 px-4 py-2.5 rounded-xl bg-[#2D4A3E] hover:bg-[#385C4D] text-[#FAF8F5] text-sm font-semibold flex items-center justify-center gap-2 shadow-lg transition-colors border border-[#3E6554]"
          >
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Stay Logged In</span>
          </button>
        </div>
      </div>
    </div>
  );
};

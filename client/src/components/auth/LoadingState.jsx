import React from 'react';
import { Loader2, ShieldCheck } from 'lucide-react';

export const LoadingState = ({ message = 'Connecting to Urban Furniture ledger...' }) => {
  return (
    <div className="py-12 flex flex-col items-center justify-center text-center space-y-4 animate-fadeIn">
      <div className="relative">
        <div className="w-14 h-14 rounded-2xl bg-[#2D4A3E]/10 flex items-center justify-center">
          <Loader2 className="w-7 h-7 text-[#2D4A3E] animate-spin" />
        </div>
      </div>
      <div className="space-y-1">
        <h4 className="font-serif-luxury font-bold text-base text-[#141A17]">
          Authenticating
        </h4>
        <p className="text-xs text-[#6A7570] max-w-xs">
          {message}
        </p>
      </div>
      <div className="flex items-center gap-1.5 text-[10px] text-[#8C9892] pt-2">
        <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
        <span>Enterprise 256-bit Encrypted Session</span>
      </div>
    </div>
  );
};

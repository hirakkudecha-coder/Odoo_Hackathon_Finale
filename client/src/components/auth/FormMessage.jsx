import React from 'react';
import { AlertCircle, CheckCircle2, Info } from 'lucide-react';

export const FormMessage = ({ type = 'error', message, onClose }) => {
  if (!message) return null;

  const styles = {
    error: {
      bg: 'bg-red-50/80 border-red-200 text-red-800',
      icon: <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
    },
    success: {
      bg: 'bg-emerald-50/80 border-emerald-200 text-emerald-800',
      icon: <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
    },
    info: {
      bg: 'bg-stone-50 border-[#DDD5C9] text-[#2D4A3E]',
      icon: <Info className="w-4 h-4 text-[#2D4A3E] shrink-0 mt-0.5" />
    }
  };

  const current = styles[type] || styles.error;

  return (
    <div className={`flex items-start gap-2.5 p-3 rounded-xl border text-xs animate-fadeIn ${current.bg}`}>
      {current.icon}
      <div className="flex-1 leading-relaxed">
        {message}
      </div>
      {onClose && (
        <button 
          type="button" 
          onClick={onClose}
          className="text-stone-400 hover:text-stone-700 text-xs px-1 cursor-pointer"
        >
          ✕
        </button>
      )}
    </div>
  );
};

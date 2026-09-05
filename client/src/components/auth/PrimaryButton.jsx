import React from 'react';
import { ArrowRight, Loader2 } from 'lucide-react';

export const PrimaryButton = ({
  children,
  type = 'submit',
  onClick,
  disabled = false,
  loading = false,
  fullWidth = true,
  className = '',
  icon: Icon = ArrowRight,
}) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`
        relative inline-flex items-center justify-center gap-2 py-3.5 px-6 
        rounded-xl text-xs sm:text-[13px] font-semibold uppercase tracking-wider text-[#FAF8F5]
        bg-[#2D4A3E] hover:bg-[#1E332A] active:bg-[#14231C]
        border border-[#1E332A]/20 shadow-md hover:shadow-lg
        transition-all duration-200 enabled:cursor-pointer select-none
        disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:bg-[#2D4A3E]
        ${fullWidth ? 'w-full' : ''}
        ${className}
      `}
    >
      {loading ? (
        <>
          <Loader2 className="w-4 h-4 animate-spin text-[#FAF8F5]" />
          <span>Processing...</span>
        </>
      ) : (
        <>
          <span>{children}</span>
          {Icon && <Icon className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />}
        </>
      )}
    </button>
  );
};

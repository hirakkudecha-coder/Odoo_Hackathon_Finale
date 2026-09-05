import React from 'react';
import { Mail, AlertCircle } from 'lucide-react';

export const InputField = ({
  id,
  label,
  type = 'text',
  value,
  onChange,
  placeholder,
  required = false,
  error,
  icon: Icon = Mail,
  autoComplete,
  disabled = false,
}) => {
  return (
    <div className="space-y-1.5 w-full text-left">
      {label && (
        <label 
          htmlFor={id} 
          className="block text-[11px] font-semibold tracking-wider uppercase text-[#4A5550]"
        >
          {label} {required && <span className="text-[#E86034]">*</span>}
        </label>
      )}
      
      <div className="relative">
        {Icon && (
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#8C9892]">
            <Icon className="w-4 h-4" />
          </div>
        )}

        <input
          id={id}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          autoComplete={autoComplete}
          disabled={disabled}
          className={`w-full bg-[#FFFFFF] border rounded-xl py-3 text-xs sm:text-[13px] text-[#141A17] placeholder:text-[#9EA8A2] transition-all duration-200 outline-none
            ${Icon ? 'pl-10' : 'pl-3.5'} pr-3.5
            ${error 
              ? 'border-[#E86034] ring-1 ring-[#E86034]/20 bg-red-50/10' 
              : 'border-[#DDD5C9] hover:border-[#B5AAA0] focus:border-[#2D4A3E] focus:ring-2 focus:ring-[#2D4A3E]/15 shadow-2xs'
            }
            ${disabled ? 'opacity-60 cursor-not-allowed bg-gray-50' : ''}
          `}
        />
      </div>

      {error && (
        <p className="flex items-center gap-1 text-[11px] text-[#E86034] animate-fadeIn">
          <AlertCircle className="w-3 h-3 shrink-0" />
          <span>{error}</span>
        </p>
      )}
    </div>
  );
};

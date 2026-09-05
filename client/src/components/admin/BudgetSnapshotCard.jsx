import React, { useState } from 'react';
import { ChevronDown, Sparkles, CheckCircle2 } from 'lucide-react';

export const BudgetSnapshotCard = () => {
  const [fyFilter, setFyFilter] = useState('FY 2026');

  // Gauge calculation: 71% of circumference 2 * PI * 40 = 251.32
  const percentage = 71;
  const radius = 38;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="bg-white rounded-2xl p-5 border border-[#E8E1D5] shadow-2xs flex flex-col justify-between h-full text-left">
      
      {/* Top Header */}
      <div className="flex items-center justify-between mb-4 pb-2 border-b border-[#F0EAE1]">
        <h3 className="font-serif font-bold text-base sm:text-lg text-[#141A17]">
          Budget Snapshot
        </h3>

        <button className="flex items-center gap-1.5 text-[11px] font-semibold text-[#4A5550] bg-[#FAF8F5] border border-[#E4DCD0] px-2.5 py-1 rounded-lg hover:bg-[#F2ECE3] transition-colors cursor-pointer">
          <span>{fyFilter}</span>
          <ChevronDown className="w-3 h-3" />
        </button>
      </div>

      {/* Donut Progress and Figures */}
      <div className="flex items-center justify-between gap-4 my-auto py-2">
        
        {/* Circular Donut Gauge */}
        <div className="relative w-24 h-24 flex items-center justify-center shrink-0">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
            {/* Background Track */}
            <circle
              cx="50"
              cy="50"
              r={radius}
              stroke="#EDE6DB"
              strokeWidth="9"
              fill="transparent"
            />
            {/* Progress Segment (Forest Green) */}
            <circle
              cx="50"
              cy="50"
              r={radius}
              stroke="#244637"
              strokeWidth="9"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              fill="transparent"
              className="transition-all duration-1000 ease-out"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="font-serif font-bold text-lg text-[#141A17] leading-none">
              71%
            </span>
          </div>
        </div>

        {/* Spend Figures */}
        <div className="flex flex-col justify-center space-y-1.5 text-left">
          <div className="font-serif font-bold text-xl text-[#141A17] leading-none">
            ₹ 1,42,000
          </div>
          <div className="text-[11px] text-[#718079] font-medium">
            of ₹ 2,00,000
          </div>

          <div className="space-y-1 pt-1 text-[10px]">
            <div className="flex items-center gap-1.5 text-[#55635D]">
              <span className="w-2 h-2 rounded-full bg-[#244637]"></span>
              <span>Actual Spend: <strong className="text-[#141A17]">₹ 1,42,000</strong></span>
            </div>
            <div className="flex items-center gap-1.5 text-[#55635D]">
              <span className="w-2 h-2 rounded-full bg-[#DDD5C7]"></span>
              <span>Planned Budget: <strong className="text-[#141A17]">₹ 2,00,000</strong></span>
            </div>
          </div>
        </div>

      </div>

      {/* Motivational Callout */}
      <div className="mt-4 p-3 rounded-xl bg-[#FAF6F0] border border-[#EBE2D5] flex items-center gap-2.5">
        <div className="w-6 h-6 rounded-full bg-[#E86034] text-white flex items-center justify-center shrink-0 text-xs">
          💼
        </div>
        <p className="text-[11px] text-[#5A4F44] leading-tight">
          You're on track to meet your budget goals this year.
        </p>
      </div>

    </div>
  );
};

export default BudgetSnapshotCard;
